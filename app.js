// app.js - Apostas Inteligentes (Node + sqlite3) - modo completo (demo)
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite');
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-this-admin-token';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Could not open database', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', DB_PATH);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    confirmed INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );`);
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health
app.get('/health', (req,res)=> res.json({status:'ok'}));

// Capture lead
app.post('/api/leads', (req,res)=>{
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success: false, error: 'email required' });
  const createdAt = new Date().toISOString();
  const stmt = db.prepare('INSERT OR IGNORE INTO leads (email, created_at) VALUES (?, ?)');
  stmt.run(email, createdAt, function(err) {
    if (err) {
      console.error('DB insert error', err);
      return res.status(500).json({ success: false, error: 'db error' });
    }
    if (this.changes === 0) {
      return res.json({ success: true, message: 'email already registered' });
    }
    return res.json({ success: true, id: this.lastID });
  });
  stmt.finalize();
});

// List leads (protected)
app.get('/api/leads', (req,res)=>{
  const token = req.header('x-admin-token') || '';
  if(token !== ADMIN_TOKEN) return res.status(401).json({ success:false, error:'unauthorized' });
  db.all('SELECT id, email, confirmed, created_at FROM leads ORDER BY created_at DESC LIMIT 1000', [], (err, rows)=>{
    if(err) return res.status(500).json({ success:false, error:'db error' });
    res.json({ success:true, leads: rows });
  });
});

// Mock analysis endpoint (demo)
app.get('/api/analysis', (req,res)=>{
  const sample = {
    timestamp: new Date().toISOString(),
    picks: [
      {market:'Resultado', suggestion:'Home', probability:0.52, reasoning:'Time da casa em boa fase, 4 vitórias nas últimas 5.'},
      {market:'Over/Under 2.5', suggestion:'Under', probability:0.61, reasoning:'Média de gols baixa nos últimos confrontos.'}
    ]
  };
  res.json(sample);
});

// Mock simulator endpoint (demo)
app.post('/api/simulate', (req,res)=>{
  const {stake, odds} = req.body || {stake:10, odds:2.1};
  if(!stake || !odds) return res.status(400).json({error:'stake and odds required'});
  const potential = parseFloat(stake) * parseFloat(odds);
  const result = {stake, odds, potential};
  res.json(result);
});

// Serve index for any other (SPA)
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public','index.html'));
});

app.listen(PORT, ()=> console.log(`Apostas Inteligentes listening on ${PORT}`));
