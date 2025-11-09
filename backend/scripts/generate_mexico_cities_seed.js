#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Usage: node generate_mexico_cities_seed.js <input-geonames-txt> [output-json]
const input = process.argv[2] || path.join(__dirname, 'cities1000.txt');
const output = process.argv[3] || path.join(__dirname, 'mexico_cities_seed.json');

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(2);
}

async function run() {
  const stream = fs.createReadStream(input, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const map = new Map(); // canonicalNameLower -> { name, lat, lon, aliases: Set }

  for await (const line of rl) {
    if (!line || line.startsWith('#')) continue;
    const cols = line.split('\t');
    // geonames columns: id(0), name(1), asciiname(2), alternatenames(3), lat(4), lon(5), ..., country(8), population(14)
    const country = cols[8];
    if (country !== 'MX') continue;
    const name = cols[1] || '';
    const asciiname = cols[2] || '';
    const alternates = cols[3] || '';
    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    const population = parseInt(cols[14] || '0', 10) || 0;

    // ignore tiny places (optional) -- keep everything, user asked for many cities

    const canonical = name.trim();
    const key = canonical.toLowerCase();
    if (!canonical) continue;

    if (!map.has(key)) {
      map.set(key, { name: canonical, lat, lon, aliases: new Set() });
    }
    const entry = map.get(key);
    if (asciiname && asciiname !== canonical) entry.aliases.add(asciiname.trim());
    if (alternates) {
      for (const a of alternates.split(',')) {
        const t = a.trim();
        if (!t) continue;
        if (t.toLowerCase() === key) continue;
        entry.aliases.add(t);
      }
    }
    // also include population-based preference: if another record with same canonical exists but bigger population, keep coords
    if (population > 0) {
      // simple heuristic: prefer larger population to set lat/lon
      if (!entry._pop || population > entry._pop) {
        entry.lat = lat;
        entry.lon = lon;
        entry._pop = population;
      }
    }
  }

  // Build array
  const out = [];
  for (const [k, v] of map.entries()) {
    const aliases = Array.from(v.aliases).filter(a => a && a.toLowerCase() !== v.name.toLowerCase());
    out.push({ name: v.name, lat: Number(v.lat.toFixed(6)), lon: Number(v.lon.toFixed(6)), aliases });
  }

  // sort by name
  out.sort((a, b) => a.name.localeCompare(b.name, 'es'));

  fs.writeFileSync(output, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} cities to ${output}`);
}

run().catch(err => { console.error(err); process.exit(1); });
