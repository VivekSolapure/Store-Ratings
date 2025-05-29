const db = require('../config/db');


const createRating = async (userId, storeId, rating, comment) => {
  const [result] = await db.query(
    'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, storeId, rating, comment]
  );
  return result.insertId;
};


const updateRating = async (ratingId, rating, comment) => {
  const [result] = await db.query(
    'UPDATE ratings SET rating = ?, comment = ? WHERE id = ?',
    [rating, comment, ratingId]
  );
  return result.affectedRows > 0;
};


const getRatingById = async (ratingId) => {
  const [rows] = await db.query(
    'SELECT * FROM ratings WHERE id = ?',
    [ratingId]
  );
  return rows[0];
};


const getRatingsByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM ratings WHERE user_id = ?',
    [userId]
  );
  return rows;
};


const getRatingsByStoreId = async (storeId) => {
  const [rows] = await db.query(
    'SELECT * FROM ratings WHERE store_id = ?',
    [storeId]
  );
  return rows;
};


const getAverageRatingByStore = (storeId) => {
  return db.execute(
    `SELECT ROUND(AVG(rating), 2) as avg FROM ratings WHERE store_id = ?`,
    [storeId]
  );
};

const deleteRating = async (ratingId) => {
  const [result] = await db.query(
    'DELETE FROM ratings WHERE id = ?',
    [ratingId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createRating,
  updateRating,
  getRatingById,
  getRatingsByStoreId,
  getRatingsByUserId,
  deleteRating
};
