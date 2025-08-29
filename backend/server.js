// backend/server.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/health', (_req, res) => res.json({ ok: true })); // tiny health check


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DB setup
const db = new sqlite3.Database(path.join(__dirname, 'cards.db'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    node TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Health + root
app.get('/', (_req, res) => res.send('river-api ✓ — try GET /health or /cards'));
app.get('/health', (_req, res) => res.json({ ok: true }));

// List latest 20
app.get('/cards', (_req, res) => {
  db.all(
    `SELECT id, type, node, created_at, payload_json
     FROM cards ORDER BY created_at DESC LIMIT 20`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows.map(r => ({
        id: r.id,
        type: r.type,
        node: r.node,
        created_at: r.created_at,
        payload: JSON.parse(r.payload_json || '{}')
      })));
    }
  );
});

// Create
app.post('/cards', (req, res) => {
  const { type, node, payload } = req.body;

  if (type !== 'journal') return res.status(422).json({ field:'type', issue:'must be "journal"' });
  if (!['mind','heart','body'].includes(node)) return res.status(422).json({ field:'node', issue:'mind/heart/body only' });
  if (!payload || typeof payload !== 'object') return res.status(422).json({ field:'payload', issue:'must be object' });

  db.run(
    `INSERT INTO cards(type, node, payload_json) VALUES (?,?,?)`,
    [type, node, JSON.stringify(payload)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, created_at: new Date().toISOString() });
    }
  );
});

app.listen(PORT, '0.0.0.0', () => console.log(`server listening on ${PORT}`));

