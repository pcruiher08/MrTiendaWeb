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
  db.run('BEGIN TRANSACTION');
  // Clear existing distributors
  db.run('DELETE FROM distributors', function(err) {
    if (err) {
      console.error('Failed to clear distributors:', err.message);
      process.exit(5);
    }
  });

  const stmt = db.prepare(`INSERT INTO distributors (name, city, contact, phone, email, experience, logo, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  let pos = 1;
  for (const r of rows) {
    // Ensure NOT NULL required fields in DB: phone and email -- use empty string when missing
    const phone = r.phone || '';
    const email = r.email || '';
    stmt.run(r.name, r.city, r.contact, phone, email, 'Nuevo', null, pos);
    pos++;
  }
  stmt.finalize(err => {
    if (err) console.error('Finalize error', err);
    db.run('COMMIT', (cErr) => {
      if (cErr) console.error('Commit error', cErr);
      console.log(`Imported ${rows.length} distributors into ${dbPath}`);
      // show top 5
      db.all('SELECT id, name, city, contact, phone, email, position FROM distributors ORDER BY position ASC LIMIT 10', [], (qErr, qRows) => {
        if (qErr) console.error('Query error', qErr);
        console.table(qRows);
        db.close();
      });
    });
  });
});
