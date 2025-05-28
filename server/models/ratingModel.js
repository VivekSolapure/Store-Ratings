// models/ratingModel.js
const db = require('../config/db');

/**
 * Submit a new rating
 */
exports.submitRating = (userId, storeId, rating) => {
  return db.execute(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
    [userId, storeId, rating]
  );
};

/**
 * Update existing rating
 */
exports.updateRating = (userId, storeId, rating) => {
  return db.execute(
    'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
    [rating, userId, storeId]
  );
};

/**
 * Check if rating exists
 */
exports.findRatingByUserAndStore = (userId, storeId) => {
  return db.execute(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
    [userId, storeId]
  );
};

/**
 * Get all ratings by a user
 */
exports.getRatingsByUser = (userId) => {
  return db.execute(
    `SELECT r.rating, s.name AS store_name 
     FROM ratings r 
     JOIN stores s ON r.store_id = s.id 
     WHERE r.user_id = ?`,
    [userId]
  );
};

/**
 * Get all ratings for a store
 */
exports.getRatingsByStore = (storeId) => {
  return db.execute(
    `SELECT u.name, u.email, r.rating 
     FROM ratings r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.store_id = ?`,
    [storeId]
  );
};

/**
 * Get average rating for a store
 */
exports.getAverageRatingByStore = (storeId) => {
  return db.execute(
    `SELECT ROUND(AVG(rating), 2) as avg FROM ratings WHERE store_id = ?`,
    [storeId]
  );
};
