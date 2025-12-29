const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const GLOBAL_SECURITY_CODE = process.env.GLOBAL_SECURITY_CODE || '1234';

// Check global security code first (frontend should enforce before showing auth)
router.post('/verify-code', (req, res) => {
  const { code } = req.body;
  if (String(code) === String(GLOBAL_SECURITY_CODE)) return res.json({ ok: true });
  return res.status(401).json({ error: 'Wrong code' });
});

// Register: only allow if no user exists (single shared account)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const row = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
    if (row.cnt > 0) return res.status(400).json({ error: 'Account already exists' });
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const info = stmt.run(email, hash);
    const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
