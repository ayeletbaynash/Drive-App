const express = require('express');
const router = express.Router();
const tokensController = require('../controllers/tokens');

// Login: Send username and password to receive an ID (Token in the future)
router.post('/tokens', userController.loginUser);

module.exports = router;