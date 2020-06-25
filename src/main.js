const mariadb = require('mariadb');
const express = require('express');
const initServer = require('./server');
const SQL = require('./sql');

(async () => {
  try {
    const pool = mariadb.createPool({
      host: 'localhost',
      user: 'root',
      password: 'root',
      connectionLimit: 5,
      database: "redirect"
    });
    const conn = await pool.getConnection();
    const res = await conn.query(SQL.CREATE);
    // Express
    const app = express();
    app.set('dbcon', conn);
    initServer(app);
  } catch (e) {
    console.error('DB Con error', e);
  }
})();
