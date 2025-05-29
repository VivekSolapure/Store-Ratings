const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { addStore } = require('../controllers/storeController');

const {
  createUser, createStore, getDashboardStats,
  listUsers, listStores, getUserDetails, getUsers
} = require('../controllers/adminController');

router.use(authenticate, authorizeRoles('admin'));

router.post('/add-user', createUser);
router.post('/add-store', async (req, res, next) => {
  try {
    await createStore(req, res);
  } catch (err) {
    next(err);
  }
});
router.get('/stats', getDashboardStats);
router.get('/listusers', listUsers);
router.get('/stores', listStores);
router.get('/user/:id', getUserDetails);
router.get('/users', getUsers);

module.exports = router;
