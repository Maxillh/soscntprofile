const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const dbFile = path.join(__dirname, 'view_count.json');

app.use(cors());
app.use(express.json());

function readCount() {
  try {
    if (!fs.existsSync(dbFile)) return 0;
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Number(parsed.value) || 0;
  } catch (err) {
    console.error('readCount error', err);
    return 0;
  }
}

function writeCount(v) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify({ value: Number(v) }, null, 2), 'utf8');
  } catch (err) {
    console.error('writeCount error', err);
  }
}

// Ensure file exists
if (!fs.existsSync(dbFile)) {
  writeCount(0);
}

// Increment and return
app.get('/hit', (req, res) => {
  const current = readCount();
  const next = current + 1;
  writeCount(next);
  res.json({ value: next });
});

// Return current count without incrementing
app.get('/count', (req, res) => {
  const current = readCount();
  res.json({ value: current });
});

app.listen(port, () => {
  console.log(`View counter server listening on http://localhost:${port}`);
});
