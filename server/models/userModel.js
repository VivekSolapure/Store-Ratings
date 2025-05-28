const db = require('../config/db');

const createUser = async (user) => {
  const { name, email, address, password, role } = user;
  const sql = `INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)`;
  const [result] = await db.execute(sql, [name, email, address, password, role]);
  return result;
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