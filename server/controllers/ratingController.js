// controllers/ratingController.js
const db = require('../config/db');

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    // Check if rating already exists
    const [existing] = await db.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Rating already submitted. Use update instead.' });
    }

    await db.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateRating = async (req, res) => {
  const { rating } = req.body;
  const { storeId } = req.params;
  const userId = req.user.id;
  console.log(rating,storeId,userId);
  

  try {
    const [existing] = await db.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'No rating to update. Submit first.' });
    }

    await db.execute(
      'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
      [rating, userId, storeId]
    );

    res.status(200).json({ message: 'Rating updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyRatings = async (req, res) => {
  const userId = req.user.id;

  try {
    const [ratings] = await db.execute(
      `SELECT r.rating, s.name AS store_name 
       FROM ratings r 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.user_id = ?`,
      [userId]
    );

    res.status(200).json({ ratings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
