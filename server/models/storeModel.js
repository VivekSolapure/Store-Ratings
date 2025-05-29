const db = require('../config/db');

const createStore = async (store) => {
  const { name, email, address, owner_id } = store;
  const sql = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;
  return await db.execute(sql, [name, email, address, owner_id]);
};

const getAllStores = (callback) => {
  db.query(
    `SELECT s.*, 
      IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating
     FROM stores s
     LEFT JOIN ratings r ON s.id = r.store_id
     GROUP BY s.id`,
    callback
  );
};

module.exports = { createStore, getAllStores };
