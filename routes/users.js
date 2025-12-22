const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 

// Registration: Submit new user details
router.post('/', userController.registerUser);

// Get user information: Retrieve by ID in the path
router.get('/:id', userController.getUserProfile);

module.exports = router;