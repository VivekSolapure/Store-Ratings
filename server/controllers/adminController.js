const { createUser, getAllUsers, getUserById } = require('../models/userModel');
const { createStore, getAllStores } = require('../models/storeModel');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUserByAdmin = (req, res) => {
  const { name, email, address, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Hash error' });

    createUser({ name, email, address, password: hash, role }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ 
        message: 'User added successfully',
        userId: result.insertId
      });
    });
  });
};

const createStoreByAdmin = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    console.log('Received store data:', { name, email, address, owner_id });

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // First check if user exists
    const [users] = await db.execute('SELECT id FROM users WHERE id = ?', [owner_id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: `User with ID ${owner_id} not found` });
    }

    // Create store using promise
    await db.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );

    res.status(201).json({ message: 'Store added successfully' });
  } catch (err) {
    console.error('Store creation error:', err);
    res.status(500).json({ message: 'Error creating store' });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM stores) AS total_stores,
        (SELECT COUNT(*) FROM ratings) AS total_ratings`
    );
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error' });
  }
};


const listUsers = (req, res) => {
  getAllUsers((err, users) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json(users);
  });
};

const listStores = (req, res) => {
  getAllStores((err, stores) => {
    if (err) return res.status(500).json({ message: 'Error fetching stores' });
    res.status(200).json(stores);
  });
};

const getUserDetails = (req, res) => {
  const id = req.params.id;
  getUserById(id, (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result[0]);
  });
};

const getUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT u.*, 
        CASE 
          WHEN u.role = 'store_owner' THEN 
            (SELECT ROUND(AVG(r.rating), 1) 
             FROM ratings r 
             JOIN stores s ON r.store_id = s.id 
             WHERE s.owner_id = u.id)
          ELSE NULL 
        END as rating
      FROM users u
    `);
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser: createUserByAdmin,
  createStore: createStoreByAdmin,
  getDashboardStats,
  listUsers,
  listStores,
  getUserDetails,
  getUsers,
};
