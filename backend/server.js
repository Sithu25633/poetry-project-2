const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Ensure uploads dir exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/media', require('./routes/media'));
app.use('/letters', require('./routes/letters'));
app.use('/counter', require('./routes/counter'));
app.use('/ai', require('./routes/ai'));

// Serve uploaded files with a small static router (protected in routes)
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/', (req, res) => res.json({ msg: 'Romantic memories backend' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
