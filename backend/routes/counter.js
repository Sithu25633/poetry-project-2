const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Set counter (replace existing)
router.post('/', auth, (req, res) => {
  const { title, start_date } = req.body;
  if (!title || !start_date) return res.status(400).json({ error: 'Missing fields' });
  try {
    // Clear existing
    db.prepare('DELETE FROM counter').run();
    const stmt = db.prepare('INSERT INTO counter (title, start_date) VALUES (?, ?)');
    const info = stmt.run(title, start_date);
    const cnt = db.prepare('SELECT * FROM counter WHERE id = ?').get(info.lastInsertRowid);
    res.json({ counter: cnt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, (req, res) => {
  try {
    const cnt = db.prepare('SELECT * FROM counter ORDER BY id DESC LIMIT 1').get();
    res.json({ counter: cnt || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
