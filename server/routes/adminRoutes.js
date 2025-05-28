const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  createUser, createStore, getDashboardStats,
  listUsers, listStores, getUserDetails
} = require('../controllers/adminController');

router.use(authenticate, authorizeRoles('admin','super admin'));

router.post('/add-user', createUser);
router.post('/add-store', createStore);
router.get('/stats', getDashboardStats);
router.get('/listusers', listUsers);
router.get('/stores', listStores);
router.get('/user/:id', getUserDetails);

module.exports = router;
