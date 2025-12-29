const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-\_ ]/g, '_');
    cb(null, `${ts}_${safe}`);
  }
});

const upload = multer({ storage });

// Upload multiple files (photos or videos)
router.post('/upload', auth, upload.array('files', 50), (req, res) => {
  try {
    const folder = req.body.folder || 'root';
    const stmt = db.prepare('INSERT INTO media (filename, originalname, mimetype, folder) VALUES (?, ?, ?, ?)');
    const inserted = [];
    for (const f of req.files) {
      stmt.run(f.filename, f.originalname, f.mimetype, folder);
      inserted.push({ filename: f.filename, originalname: f.originalname, mimetype: f.mimetype, folder });
    }
    res.json({ ok: true, files: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all media
router.get('/', auth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
    res.json({ media: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve media file
router.get('/file/:filename', auth, (req, res) => {
  const filename = req.params.filename;
  const p = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(p)) return res.status(404).end();
  res.sendFile(p);
});

module.exports = router;
