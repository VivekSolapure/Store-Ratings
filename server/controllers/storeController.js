// controllers/storeController.js
const db = require('../config/db');

exports.submitOrUpdateRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      message: 'Rating must be between 1 and 5' 
    });
  }

  try {
    // Check if store exists
    const [stores] = await db.execute(
      'SELECT id FROM stores WHERE id = ?',
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({ 
        message: 'Store not found' 
      });
    }

    // Check if user has already rated this store
    const [existing] = await db.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await db.execute(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
    } else {
      // Create new rating (without created_at as it's handled by DEFAULT)
      await db.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );
    }

    // Get updated average rating
    const [avgResult] = await db.execute(
      'SELECT ROUND(AVG(rating), 1) as avgRating FROM ratings WHERE store_id = ?',
      [storeId]
    );

    return res.status(existing.length > 0 ? 200 : 201).json({
      message: existing.length > 0 ? 'Rating updated successfully' : 'Rating submitted successfully',
      averageRating: avgResult[0].avgRating
    });

  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ 
      message: 'Error processing rating' 
    });
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

exports.getStoreDetails = async (req, res) => {
  const ownerId = req.user.id;
  
  try {
    // Get store details with average rating
    const [stores] = await db.execute(`
      SELECT s.*, 
        COALESCE(ROUND(AVG(r.rating), 1), 0) as averageRating,
        COUNT(r.id) as totalRatings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY s.id
    `, [ownerId]);

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ store: stores[0] });
  } catch (err) {
    console.error('Error fetching store details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStoreRatings = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [ratings] = await db.execute(`
      SELECT r.*, u.name as userName, u.email as userEmail
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = ?
      ORDER BY r.created_at DESC
    `, [ownerId]);

    res.status(200).json({ ratings });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addStore = async (req, res) => {
  const { name, email, address } = req.body;
  // If you have authentication, get the owner ID from req.user
  const ownerId = req.user?.id; // or however you store the owner

  // Validation (add more as needed)
  if (!name || !email || !address || !ownerId) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    await db.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );
    res.status(201).json({ message: 'Store added successfully' });
  } catch (err) {
    console.error('Error adding store:', err);
    res.status(500).json({ message: 'Error adding store' });
  }
};