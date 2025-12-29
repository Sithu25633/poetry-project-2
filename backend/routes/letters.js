const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a letter
router.post('/', auth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  try {
    const stmt = db.prepare('INSERT INTO letters (content) VALUES (?)');
    const info = stmt.run(content);
    const letter = db.prepare('SELECT * FROM letters WHERE id = ?').get(info.lastInsertRowid);
    res.json({ letter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List letters (most recent first)
router.get('/', auth, (req, res) => {
  try {
    const letters = db.prepare('SELECT * FROM letters ORDER BY created_at DESC').all();
    res.json({ letters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
