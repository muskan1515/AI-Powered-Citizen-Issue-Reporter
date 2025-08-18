const express = require('express');
const { getProfile, updateProfile } = require('../controllers/user.controllers');
const authMiddleware = require('../middleware/authMiddleware');
const { profileUpdateValidator } = require('../validators/user.validator');

const router = express.Router();

router.get('/me', authMiddleware.protect , getProfile);
router.put('/me', authMiddleware.protect, profileUpdateValidator, updateProfile);

module.exports = router;
