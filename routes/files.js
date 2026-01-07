const express = require('express');
const router = express.Router();
const fileController = require('../controllers/files'); // File controller
const verifyToken = require('../middleware/auth'); // tokens

// Protect all the routes at once in this file
router.use(verifyToken); 

// GET all files/folders for the connected user
router.get('/', fileController.getFiles);

// POST a new file or folder
router.post('/', fileController.postFile);

// GET a single file/folder by ID
router.get('/:id', fileController.getFileById);

// PATCH an existing file/folder by ID
router.patch('/:id', fileController.patchFile);

// DELETE a file/folder by ID
router.delete('/:id', fileController.deleteFile);

module.exports = router;