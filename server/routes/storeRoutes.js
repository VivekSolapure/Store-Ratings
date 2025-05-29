// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const {submitOrUpdateRating,getAllStores} = require('../controllers/storeController');
const { authenticate } = require('../middlewares/authMiddleware');
const { getStoreDetails, getStoreRatings } = require('../controllers/storeController');

router.get('/stores', getAllStores);
router.get('/store-owner/dashboard', authenticate, submitOrUpdateRating);
router.post('/stores/:storeId/rate', authenticate, submitOrUpdateRating);

// Protect all routes
router.use(authenticate);

router.get('/details', getStoreDetails);
router.get('/ratings', getStoreRatings);

module.exports = router;
