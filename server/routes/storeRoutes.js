// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const {getUserRatings,submitOrUpdateRating,getAllStores} = require('../controllers/storeController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/stores', getAllStores);
router.get('/store-owner/dashboard', authenticate, submitOrUpdateRating);
router.get('/store-owner/details', authenticate, getUserRatings);

module.exports = router;
