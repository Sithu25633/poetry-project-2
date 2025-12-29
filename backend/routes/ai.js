const express = require('express');
const fetch = require('node-fetch');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Generate romantic content using Gemini (placeholder). Provide simple wrapper.
router.post('/generate', auth, async (req, res) => {
  const { prompt, type } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  if (!GEMINI_API_KEY) {
    // Return mock result when no key provided
    return res.json({ result: `(mock) ${type || 'message'}: ${prompt} — love you forever ❤` });
  }

  try {
    // NOTE: Replace this with real Gemini API REST call per your account.
    const response = await fetch('https://api.example.com/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    // Transform according to actual Gemini response shape
    res.json({ result: data.output || data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
