// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', authenticate, ratingController.submitRating);
router.put('/:storeId', authenticate, ratingController.updateRating);
router.get('/mine', authenticate, ratingController.getMyRatings);

module.exports = router;
