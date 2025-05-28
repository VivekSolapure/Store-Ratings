// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const {submitOrUpdateRating,getAllStores} = require('../controllers/storeController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/stores', getAllStores);
router.get('/store-owner/dashboard', authenticate, submitOrUpdateRating);
router.post('/stores/:storeId/rate', authenticate, submitOrUpdateRating);

module.exports = router;
