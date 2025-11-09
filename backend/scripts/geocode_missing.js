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
// normalize keys
const normalizedCityCache = {};
for (const k of Object.keys(cityCache)) normalizedCityCache[k.trim().toLowerCase()] = cityCache[k];
cityCache = normalizedCityCache;

// load seed
try {
  const seedPath = path.join(__dirname, 'mexico_cities_seed.json');
  if (fs.existsSync(seedPath)) {
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    for (const entry of seed) {
      if (!entry || !entry.name) continue;
      const coords = { lat: entry.lat, lon: entry.lon };
      const cCanonical = entry.name.trim().toLowerCase();
      if (!cityCache[cCanonical]) cityCache[cCanonical] = coords;
      if (Array.isArray(entry.aliases)) {
        for (const a of entry.aliases) {
          const an = (a || '').trim().toLowerCase();
          if (an && !cityCache[an]) cityCache[an] = coords;
        }
      }
    }
  }
} catch (e) {
  // ignore
}

function levenshtein(a, b) {
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i][0] = i;
  for (let j = 0; j <= bl; j++) dp[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[al][bl];
}

function findFuzzyMatch(city) {
  const key = city.trim().toLowerCase();
  if (!key) return null;
  if (cityCache[key]) return { key, coords: cityCache[key], score: 0 };
  let best = { key: null, score: Infinity };
  for (const k of Object.keys(cityCache)) {
    if (k.includes(key) || key.includes(k)) return { key: k, coords: cityCache[k], score: 0 };
    const d = levenshtein(key, k);
    const rel = d / Math.max(key.length, k.length);
    if (rel < best.score) best = { key: k, score: rel };
  }
  if (best.key && best.score <= 0.35) return { key: best.key, coords: cityCache[best.key], score: best.score };
  return null;
}

async function geocodeCity(city) {
  if (!city) return null;
  const lookup = city.trim().toLowerCase();
  if (cityCache[lookup]) return cityCache[lookup];
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=${encodeURIComponent(lookup)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MrTiendaWeb-Importer/1.0 (email@example.com)' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      const p = { lat: parseFloat(lat), lon: parseFloat(lon) };
      cityCache[lookup] = p;
      fs.writeFileSync(cachePath, JSON.stringify(cityCache, null, 2), 'utf8');
      return p;
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function run() {
  const db = new sqlite3.Database(dbPath);
  // ensure columns exist
  db.serialize(() => {
    db.run(`ALTER TABLE distributors ADD COLUMN latitude REAL`, () => {});
    db.run(`ALTER TABLE distributors ADD COLUMN longitude REAL`, () => {});
  });

  // get unique cities missing coords
  const cities = await new Promise((resolve, reject) => {
    db.all(`SELECT DISTINCT TRIM(city) AS city FROM distributors WHERE (latitude IS NULL OR longitude IS NULL) AND city IS NOT NULL AND TRIM(city) <> ''`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(r => r.city));
    });
  });

  console.log(`Found ${cities.length} unique cities missing coords`);

  for (const c of cities) {
    const key = (c || '').trim().toLowerCase();
    if (!key) continue;
    if (cityCache[key]) {
      console.log(`Cache hit for ${c}`);
      continue;
    }
    const fuzzy = findFuzzyMatch(c);
    if (fuzzy && fuzzy.coords) {
      console.log(`Fuzzy match for ${c} -> ${fuzzy.key}`);
      cityCache[key] = fuzzy.coords;
      fs.writeFileSync(cachePath, JSON.stringify(cityCache, null, 2), 'utf8');
      continue;
    }
    console.log(`Geocoding ${c} ...`);
    // polite delay
    // eslint-disable-next-line no-await-in-loop
    const p = await geocodeCity(c);
    if (p) console.log(` -> ${p.lat},${p.lon}`);
    else console.log(' -> not found');
    // wait 1s between lookups
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, 1000));
  }

  // apply updates: for each cached city, update distributors with matching trimmed lower city
  const updates = [];
  for (const k of Object.keys(cityCache)) {
    const coords = cityCache[k];
    updates.push({ key: k, coords });
  }

  for (const u of updates) {
    const { key, coords } = u;
    // update rows whose lower(trim(city)) === key
    await new Promise((resolve, reject) => {
      db.run(`UPDATE distributors SET latitude = ?, longitude = ? WHERE LOWER(TRIM(city)) = ?`, [coords.lat, coords.lon, key], function(err) {
        if (err) return reject(err);
        if (this.changes > 0) console.log(`Updated ${this.changes} rows for city '${key}'`);
        resolve();
      });
    });
  }

  // final summary
  const count = await new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS cnt FROM distributors WHERE latitude IS NOT NULL AND longitude IS NOT NULL`, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.cnt);
    });
  });
  console.log(`Total distributors with coords: ${count}`);
  db.close();
}

run().catch(err => { console.error(err); process.exit(2); });
