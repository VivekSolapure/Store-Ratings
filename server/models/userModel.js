const db = require('../config/db');

const createUser = (user, callback) => {
  const { name, email, address, password, role } = user;
  const sql = `INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, address, password, role], (err, result) => {
    callback(err, result);  // Pass both error and result
  });
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows;
};

const getAllUsers = async () => {
  const [rows] = await db.execute(`SELECT * FROM users`);
  return rows;
};

module.exports = { createUser, getUserByEmail, getUserById, getAllUsers };