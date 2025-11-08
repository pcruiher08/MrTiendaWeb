#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

if (process.argv.length < 3) {
  console.error('Usage: node import_distributors.js <path-to-csv>');
  process.exit(2);
}

const csvPath = process.argv[2];
const dbPath = path.join(__dirname, '..', 'distribuidores.db');

function parseCSVLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { // escaped quote
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields.map(f => f.trim());
}

const raw = fs.readFileSync(csvPath, 'utf8');
// Normalize CR-only line endings (some CSV exports use \r) to \n
const normalized = raw.replace(/\r/g, '\n');
const lines = normalized.split(/\n/).filter(Boolean);
if (lines.length === 0) {
  console.error('CSV is empty');
  process.exit(3);
}

// Use header to find important columns
const header = parseCSVLine(lines[0]).map(h => h.toUpperCase());
const idx = (name) => header.indexOf(name);

const idxEmpresa = idx('EMPRESA');
const idxCiudad = idx('CIUDAD');
const idxContacto = idx('CONTACTO');
const idxTelefono = idx('TELEFONO');
const idxCelular = idx('CELULAR');
const idxCorreo = idx('CORREO');

if (idxEmpresa === -1 || idxCiudad === -1 || idxContacto === -1 || (idxTelefono === -1 && idxCelular === -1)) {
  console.warn('CSV header does not contain expected columns, falling back to positional mapping');
}

const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length === 0) continue;
  const name = (cols[idxEmpresa] || cols[0] || '').trim();
  if (!name) continue; // skip empty rows
  const city = (cols[idxCiudad] || cols[1] || '').trim();
  const contact = (cols[idxContacto] || cols[2] || '').trim();
  const phone = (cols[idxTelefono] || cols[3] || cols[idxCelular] || cols[4] || '').trim();
  const email = (cols[idxCorreo] || cols[5] || '').trim();
  rows.push({ name, city, contact, phone, email });
}

console.log(`Parsed ${rows.length} rows from CSV`);

if (!fs.existsSync(dbPath)) {
  console.error('Database not found at', dbPath);
  process.exit(4);
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Ensure latitude/longitude columns exist in case DB was created without them
  db.run(`ALTER TABLE distributors ADD COLUMN latitude REAL`, () => {});
  db.run(`ALTER TABLE distributors ADD COLUMN longitude REAL`, () => {});
  db.run('BEGIN TRANSACTION');
  // Clear existing distributors
  db.run('DELETE FROM distributors', function(err) {
    if (err) {
      console.error('Failed to clear distributors:', err.message);
      process.exit(5);
    }
  });
  // We'll geocode once per city (general coordinates per city) and store lat/lon in DB.
  const cachePath = path.join(__dirname, 'city_coords_cache.json');
  let cityCache = {};
  if (fs.existsSync(cachePath)) {
    try { cityCache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) { cityCache = {}; }
  }

  // Normalize city keys for lookup (lowercase trimmed)
  const normalizedCityCache = {};
  for (const k of Object.keys(cityCache)) {
    normalizedCityCache[k.trim().toLowerCase()] = cityCache[k];
  }
  cityCache = normalizedCityCache;

  // Helper: geocode city using Nominatim if not in cache
  async function geocodeCity(city) {
    if (!city) return null;
    const key = city.trim();
    if (cityCache[key]) return cityCache[key];
    // polite query (limit to Mexico)
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=${encodeURIComponent(key)}`;
    try {
      if (typeof fetch === 'function') {
        const res = await fetch(url, { headers: { 'User-Agent': 'MrTiendaWeb-Importer/1.0 (email@example.com)' } });
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const { lat, lon } = data[0];
          const p = { lat: parseFloat(lat), lon: parseFloat(lon) };
          cityCache[key] = p;
          fs.writeFileSync(cachePath, JSON.stringify(cityCache, null, 2), 'utf8');
          return p;
        }
      } else {
        // fallback: no fetch available
        return null;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // Determine unique cities
  const uniqueCities = Array.from(new Set(rows.map(r => (r.city || '').trim()).filter(Boolean)));
  // Geocode sequentially with small delay so we don't hammer the service
  (async () => {
    for (const c of uniqueCities) {
      const lookup = c.trim().toLowerCase();
      if (!cityCache[lookup]) {
        // eslint-disable-next-line no-await-in-loop
        const p = await geocodeCity(c);
        if (p) cityCache[lookup] = p;
        // wait 1s between requests
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const stmt = db.prepare(`INSERT INTO distributors (name, city, contact, phone, email, experience, logo, position, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    let pos = 1;
    for (const r of rows) {
      const phone = r.phone || '';
      const email = r.email || '';
      const lookup = r.city ? r.city.trim().toLowerCase() : '';
      const coords = (lookup && cityCache[lookup]) ? cityCache[lookup] : null;
  // If no city coordinates available, default to Mexico City coordinates
  const DEFAULT_LAT = 19.432608;
  const DEFAULT_LON = -99.133209;
  const lat = coords ? coords.lat : DEFAULT_LAT;
  const lon = coords ? coords.lon : DEFAULT_LON;
  stmt.run(r.name, r.city, r.contact, phone, email, '', null, pos, lat, lon);
      pos++;
    }
    stmt.finalize(err => {
      if (err) console.error('Finalize error', err);
      db.run('COMMIT', (cErr) => {
        if (cErr) console.error('Commit error', cErr);
        console.log(`Imported ${rows.length} distributors into ${dbPath}`);
        // show top 10
        db.all('SELECT id, name, city, contact, phone, email, position, latitude, longitude FROM distributors ORDER BY position ASC LIMIT 10', [], (qErr, qRows) => {
          if (qErr) console.error('Query error', qErr);
          console.table(qRows);
          db.close();
        });
      });
    });
  })();
});
