#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'distribuidores.db');
const cachePath = path.join(__dirname, 'city_coords_cache.json');

if (!fs.existsSync(dbPath)) {
  console.error('Database not found at', dbPath);
  process.exit(1);
}

let cityCache = {};
if (fs.existsSync(cachePath)) {
  try { cityCache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) { cityCache = {}; }
}

const db = new sqlite3.Database(dbPath);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function geocodeCity(city) {
  if (!city) return null;
  const key = city.trim();
  if (cityCache[key]) return cityCache[key];
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MrTiendaWeb-Generator/1.0 (contact@yourdomain.example)' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      const p = { lat: parseFloat(lat), lon: parseFloat(lon) };
      cityCache[key] = p;
      fs.writeFileSync(cachePath, JSON.stringify(cityCache, null, 2), 'utf8');
      return p;
    }
  } catch (e) {
    console.error('Geocode error for', city, e && e.message);
    return null;
  }
  return null;
}

db.all("SELECT DISTINCT city FROM distributors WHERE city IS NOT NULL AND TRIM(city) <> ''", [], async (err, rows) => {
  if (err) {
    console.error('DB error', err.message);
    process.exit(2);
  }
  const cities = rows.map(r => r.city.trim()).sort();
  console.log(`Found ${cities.length} unique cities`);
  for (const city of cities) {
    if (cityCache[city]) {
      console.log(`Cached: ${city} -> ${cityCache[city].lat},${cityCache[city].lon}`);
      continue;
    }
    console.log(`Geocoding: ${city}`);
    const p = await geocodeCity(city);
    if (p) console.log(`  -> ${p.lat},${p.lon}`);
    else console.log('  -> (not found)');
    // polite pause
    await sleep(1000);
  }
  console.log('Done. Cache written to', cachePath);
  db.close();
});
