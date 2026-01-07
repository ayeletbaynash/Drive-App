const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search');
const verifyToken = require('../middleware/auth'); 

// GET /api/search/:query
router.get('/:query', verifyToken, searchController.search);

module.exports = router;