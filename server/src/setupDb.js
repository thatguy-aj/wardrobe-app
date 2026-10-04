// Runs database/schema.sql so teammates can create the tables with one command:  npm run db:setup
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });
  const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  await conn.query(sql);
  await conn.end();
  console.log('Database and tables created.');
})().catch((e) => { console.error('Setup failed:', e.message); process.exit(1); });
