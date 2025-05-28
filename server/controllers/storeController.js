// controllers/storeController.js
const db = require('../config/db');

exports.submitOrUpdateRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1 to 5' });

  try {
    const [existing] = await db.execute('SELECT * FROM Ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);

    if (existing.length > 0) {
      await db.execute('UPDATE Ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, userId, storeId]);
      return res.status(200).json({ message: 'Rating updated successfully' });
    } else {
      await db.execute('INSERT INTO Ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [userId, storeId, rating]);
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserRatings = async (req, res) => {
  const userId = req.user.id;
  try {
    const [ratings] = await db.execute(
      `SELECT r.rating, s.name as storeName FROM Ratings r JOIN Stores s ON r.store_id = s.id WHERE r.user_id = ?`,
      [userId]
    );
    res.status(200).json({ ratings });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAllStores = async (req, res) => {
  try {
    const [stores] = await db.execute(`
      SELECT s.*, 
        COALESCE(ROUND(AVG(r.rating), 1), 0) as averageRating,
        COUNT(r.id) as totalRatings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.status(200).json({ stores });
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};