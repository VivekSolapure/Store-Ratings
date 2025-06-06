const mysql = require('mysql2/promise');  // Change this line
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({  // Use createPool instead of createConnection
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// No need for connect() with createPool
console.log('✅ MySQL pool initialized!');

module.exports = db;