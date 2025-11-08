#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, 'city_coords_cache.json');

if (!fs.existsSync(cachePath)) {
  console.error('Cache file not found at', cachePath);
  process.exit(1);
}

const raw = fs.readFileSync(cachePath, 'utf8');
let data = {};
try { data = JSON.parse(raw); } catch (e) { console.error('Failed to parse JSON', e); process.exit(2); }

const normalized = {};
const originalToNormalized = {};

for (const key of Object.keys(data)) {
  const norm = key.trim().toLowerCase();
  if (!normalized[norm]) {
    normalized[norm] = data[key];
  }
  originalToNormalized[key] = norm;
}

fs.writeFileSync(cachePath, JSON.stringify(normalized, null, 2), 'utf8');
console.log('Normalized cache written to', cachePath);
console.log('Original keys mapped to normalized keys for', Object.keys(originalToNormalized).length, 'entries');

// also write a helpful mapping file
fs.writeFileSync(path.join(__dirname, 'city_cache_key_map.json'), JSON.stringify(originalToNormalized, null, 2), 'utf8');
console.log('Wrote city_cache_key_map.json');
