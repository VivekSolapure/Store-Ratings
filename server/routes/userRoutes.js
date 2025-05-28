const express = require('express');
const router = express.Router();
const { changePassword,getUserRatings } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const {} = require('../controllers/userController');

router.post('/change-password', authenticate, changePassword);
router.get('/ratings', authenticate, getUserRatings);


module.exports = router;
