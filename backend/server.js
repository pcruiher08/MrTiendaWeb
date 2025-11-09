const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files but do not automatically serve index.html so we can inject diagnostics into the page
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Database setup
const db = new sqlite3.Database('./distribuidores.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Load mexico cities seed and city cache for fuzzy matching when creating/updating distributors
const seedPath = path.join(__dirname, 'scripts', 'mexico_cities_seed.json');
let mexicoSeed = [];
try {
  if (fs.existsSync(seedPath)) {
    mexicoSeed = JSON.parse(fs.readFileSync(seedPath, 'utf8')) || [];
    console.log(`Loaded mexico cities seed with ${mexicoSeed.length} entries`);
  }
} catch (e) {
  console.error('Failed to load mexico_cities_seed.json:', e.message);
  mexicoSeed = [];
}

const cachePath = path.join(__dirname, 'scripts', 'city_coords_cache.json');
let cityCache = {};
try {
  if (fs.existsSync(cachePath)) {
    cityCache = JSON.parse(fs.readFileSync(cachePath, 'utf8')) || {};
  }
} catch (e) {
  cityCache = {};
}
// normalize cache keys
const normalize = (s) => (s || '').trim().toLowerCase();
const normalizedCityCache = {};
for (const k of Object.keys(cityCache)) normalizedCityCache[normalize(k)] = cityCache[k];
cityCache = normalizedCityCache;

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

function findFuzzyCityMatch(city) {
  const key = normalize(city);
  if (!key) return null;
  if (cityCache[key]) return { key, coords: cityCache[key], score: 0 };
  // check seed exact or alias matches
  for (const entry of mexicoSeed) {
    if (!entry || !entry.name) continue;
    const cname = normalize(entry.name);
    if (cname === key) return { key: cname, coords: { lat: entry.lat, lon: entry.lon }, score: 0 };
    if (entry.aliases && Array.isArray(entry.aliases)) {
      for (const a of entry.aliases) if (normalize(a) === key) return { key: cname, coords: { lat: entry.lat, lon: entry.lon }, score: 0 };
    }
  }
  // fuzzy compare against seed names
  let best = { key: null, score: Infinity };
  for (const entry of mexicoSeed) {
    if (!entry || !entry.name) continue;
    const k = normalize(entry.name);
    if (!k) continue;
    if (k.includes(key) || key.includes(k)) return { key: k, coords: { lat: entry.lat, lon: entry.lon }, score: 0 };
    const d = levenshtein(key, k);
    const rel = d / Math.max(key.length, k.length);
    if (rel < best.score) best = { key: k, score: rel, coords: { lat: entry.lat, lon: entry.lon } };
  }
  if (best.key && best.score <= 0.35) return { key: best.key, coords: best.coords, score: best.score };
  return null;
}

function saveCityCache() {
  try {
    fs.writeFileSync(cachePath, JSON.stringify(cityCache, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write city cache:', e.message);
  }
}

function getCoordsForCity(city) {
  const key = normalize(city);
  if (!key) return null;
  if (cityCache[key]) return cityCache[key];
  const fuzzy = findFuzzyCityMatch(city);
  if (fuzzy && fuzzy.coords) {
    cityCache[key] = fuzzy.coords;
    saveCityCache();
    return fuzzy.coords;
  }
  return null;
}

// Start server immediately
startServer();

// Create tables
function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS distributors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      contact TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      experience TEXT,
      logo TEXT,
      position INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Distributors table created or already exists.');
      // Add position column if it doesn't exist (for existing databases)
      db.run(`ALTER TABLE distributors ADD COLUMN position INTEGER DEFAULT 0`, (alterErr) => {
        // Ignore error if column already exists
        // Try adding latitude/longitude columns as well; ignore errors if they already exist
        db.run(`ALTER TABLE distributors ADD COLUMN latitude REAL`, () => {
          db.run(`ALTER TABLE distributors ADD COLUMN longitude REAL`, () => {
            initializeData();
          });
        });
      });
    }
  });
}

// Initialize with sample data
function initializeData() {
  db.get('SELECT COUNT(*) as count FROM distributors', [], (err, row) => {
    if (err) {
      console.error('Error checking data:', err.message);
    } else if (row.count === 0) {
      const sampleData = [
        {
          name: "TechPOS Baja California",
          city: "Ensenada",
          contact: "Juan Carlos López",
          phone: "+52 (646) 123-4567",
          email: "jlopez@techpos.mx",
          experience: "8 años",
          logo: null,
          position: 0
        },
        {
          name: "Soluciones Comerciales GDL",
          city: "Guadalajara",
          contact: "María Elena Rodríguez",
          phone: "+52 (33) 2345-6789",
          email: "mrodriguez@solcom.mx",
          experience: "12 años",
          logo: null,
          position: 1
        },
        {
          name: "Sistemas Norte",
          city: "Monterrey",
          contact: "Roberto Martínez",
          phone: "+52 (81) 3456-7890",
          email: "rmartinez@sisnorte.mx",
          experience: "15 años",
          logo: null,
          position: 2
        },
        {
          name: "POS Solutions Bajío",
          city: "León",
          contact: "Ana Patricia Herrera",
          phone: "+52 (477) 456-7891",
          email: "aherrera@posbajio.mx",
          experience: "6 años",
          logo: null,
          position: 3
        },
        {
          name: "Tecnología Comercial Sur",
          city: "Mérida",
          contact: "Carlos Alberto Pérez",
          phone: "+52 (999) 567-8912",
          email: "cperez@tecsur.mx",
          experience: "10 años",
          logo: null,
          position: 4
        },
        {
          name: "Sistemas Pacífico",
          city: "Tijuana",
          contact: "Laura Fernández",
          phone: "+52 (664) 678-9123",
          email: "lfernandez@sispacifico.mx",
          experience: "9 años",
          logo: null,
          position: 5
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO distributors (name, city, contact, phone, email, experience, logo, position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleData.forEach(item => {
        stmt.run(item.name, item.city, item.contact, item.phone, item.email, item.experience, item.logo, item.position);
      });

      stmt.finalize();
      console.log('Sample data inserted.');
    }
    
    // Start the server after database is ready
    startServer();
  });
}

// Start server function
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// API Routes

// Test route
app.get('/api/test', (req, res) => {
  res.end('OK');
});

// GET all distributors
app.get('/api/distributors', (req, res) => {
  console.log('GET distributors called');
  // Return distributors ordered by their position so client reordering persists
  db.all('SELECT * FROM distributors ORDER BY position ASC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Found', rows.length, 'distributors');
    res.json(rows);
  });
});

// GET single distributor
app.get('/api/distributors/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM distributors WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Distributor not found' });
      return;
    }
    res.json(row);
  });
});

// POST create distributor
app.post('/api/distributors', upload.single('logo'), (req, res) => {
  console.log('POST DISTRIBUTORS ENDPOINT HIT - Method:', req.method, 'URL:', req.url);
  const { name, city, contact, phone, email, experience } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !city || !contact || !phone || !email) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  // Get the next position
  db.get('SELECT MAX(position) as maxPos FROM distributors', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const nextPosition = (row.maxPos || 0) + 1;

    // Try to resolve coordinates from cache/seed
    const coords = getCoordsForCity(city);
    const latitude = coords ? coords.lat : null;
    const longitude = coords ? coords.lon : null;

    db.run(`
      INSERT INTO distributors (name, city, contact, phone, email, experience, logo, position, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, city, contact, phone, email, experience || '', logo, nextPosition, latitude, longitude], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, city, contact, phone, email, experience, logo, position: nextPosition, latitude, longitude });
    });
  });
});

// PUT /api/distributors/reorder - Reorder distributors
app.put('/api/distributors/reorder', (req, res) => {
  console.log('REORDER ENDPOINT HIT - Method:', req.method, 'URL:', req.url);
  console.log('Reorder endpoint called with body:', req.body);

  const { distributorIds } = req.body;

  if (!Array.isArray(distributorIds)) {
    console.log('distributorIds is not an array:', distributorIds);
    return res.status(400).json({ error: 'distributorIds must be an array' });
  }

  console.log('Reordering distributors with IDs:', distributorIds);

  // Update positions sequentially
  let position = 1;
  let index = 0;

  const updateNext = () => {
    if (index >= distributorIds.length) {
      console.log('Successfully reordered all distributors');
      return res.json({ message: 'Distributors reordered successfully' });
    }

    const id = distributorIds[index++];
    console.log(`Updating distributor ${id} to position ${position}`);
    
    db.run(
      'UPDATE distributors SET position = ? WHERE id = ?',
      [position++, id],
      function(err) {
        if (err) {
          console.error('Error updating distributor', id, ':', err);
          return res.status(500).json({ error: 'Failed to reorder distributors' });
        }
        console.log(`Successfully updated distributor ${id}`);
        updateNext();
      }
    );
  };

  updateNext();
});

// PUT update distributor
app.put('/api/distributors/:id', upload.single('logo'), (req, res) => {
  const { id } = req.params;
  const { name, city, contact, phone, email, experience } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : req.body.logo;

  if (!name || !city || !contact || !phone || !email) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  // Get current distributor to delete old logo if new one is uploaded
  db.get('SELECT logo FROM distributors WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Delete old logo file if it exists and a new one is uploaded
    if (row && row.logo && req.file) {
      const oldLogoPath = path.join(__dirname, row.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Resolve coordinates for the updated city if possible
    const updatedCoords = getCoordsForCity(city);
    const updatedLatitude = updatedCoords ? updatedCoords.lat : null;
    const updatedLongitude = updatedCoords ? updatedCoords.lon : null;

    db.run(`
      UPDATE distributors
      SET name = ?, city = ?, contact = ?, phone = ?, email = ?, experience = ?, logo = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `, [name, city, contact, phone, email, experience || '', logo, updatedLatitude, updatedLongitude, id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Distributor not found' });
        return;
      }
      res.json({ id, name, city, contact, phone, email, experience, logo, latitude: updatedLatitude, longitude: updatedLongitude });
    });
  });
});

// DELETE distributor
app.delete('/api/distributors/:id', (req, res) => {
  const { id } = req.params;

  // Get distributor to delete logo file
  db.get('SELECT logo FROM distributors WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.run('DELETE FROM distributors WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Distributor not found' });
        return;
      }

      // Delete logo file if it exists
      if (row && row.logo) {
        const logoPath = path.join(__dirname, row.logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }

      res.json({ message: 'Distributor deleted successfully' });
    });
  });
});

// PUT /api/distributors/reorder - Reorder distributors
app.put('/api/distributors/reorder', (req, res) => {
  console.log('REORDER ENDPOINT HIT - Method:', req.method, 'URL:', req.url);
  console.log('Reorder endpoint called with body:', req.body);

  const { distributorIds } = req.body;

  if (!Array.isArray(distributorIds)) {
    console.log('distributorIds is not an array:', distributorIds);
    return res.status(400).json({ error: 'distributorIds must be an array' });
  }

  console.log('Reordering distributors with IDs:', distributorIds);

  // Update positions sequentially
  let position = 1;
  let index = 0;

  const updateNext = () => {
    if (index >= distributorIds.length) {
      console.log('Successfully reordered all distributors');
      return res.json({ message: 'Distributors reordered successfully' });
    }

    const id = distributorIds[index++];
    console.log(`Updating distributor ${id} to position ${position}`);
    
    db.run(
      'UPDATE distributors SET position = ? WHERE id = ?',
      [position++, id],
      function(err) {
        if (err) {
          console.error('Error updating distributor', id, ':', err);
          return res.status(500).json({ error: 'Failed to reorder distributors' });
        }
        console.log(`Successfully updated distributor ${id}`);
        updateNext();
      }
    );
  };

  updateNext();
});

// Catch-all handler: send back index.html for client-side routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  // Serve index.html but inject a small diagnostics script to surface client-side errors
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    const diag = `\n<script>\nwindow.addEventListener('error', function(e){ try { document.body.innerHTML = '<pre style="white-space:pre-wrap;font-family:monospace;color:#900;padding:12px;">JS Error: '+(e.message||e)+'\\n'+(e.filename||'')+':'+(e.lineno||'')+':'+(e.colno||'')+'</pre>'; } catch (ex){} });\nwindow.addEventListener('unhandledrejection', function(ev){ try { var r = ev.reason; var text = r && (r.stack||r.message) || String(r); document.body.innerHTML = '<pre style="white-space:pre-wrap;font-family:monospace;color:#900;padding:12px;">UnhandledRejection: '+ text +'</pre>'; } catch(ex){} });\n</script>\n`;
  // Use case-insensitive replace in case the build tool altered casing/whitespace
  const out = html.replace(/<\/body>/i, diag + '</body>');
  // Prevent aggressive CDN caching of index.html so diagnostic changes propagate quickly
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return res.send(out);
  } catch (err) {
    // fallback to default sendFile if anything goes wrong
    return res.sendFile(indexPath);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
  // process.exit(1); // Don't exit
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
  // process.exit(1); // Don't exit
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});