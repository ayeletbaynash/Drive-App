const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 
const verifyToken = require('../middleware/auth');

// Registration: Submit new user details
router.post('/', userController.registerUser); // available to all

// Get user information: Retrieve by ID in the path
router.get('/:id', verifyToken, userController.getUserProfile); // only verified users can

module.exports = router;