const File = require('../models/files');

// GET all files (Can filter by user_id or parent_id later)
const getFiles = async (filter = {}) => {
    return await File.find(filter);
};

// GET a single file/folder by ID
const getFileById = async (id) => {
    return await File.findById(id);
};

// POST a new file or folder
const postFile = async (fileData) => {
    // Logic from your legacy code: Validate parent folder
    if (fileData.parent_id) {
        const parent = await File.findById(fileData.parent_id);
        // Check if parent exists and is actually a folder
        if (!parent || parent.type !== 'folder') {
            throw new Error('Invalid parent folder');
        }
    }

    // Create and save the new file/folder
    const newFile = new File(fileData);
    return await newFile.save();
};

// PATCH/update an existing file/folder
const patchFile = async (id, updateData) => {
    // findByIdAndUpdate(id, data, { new: true }) returns the updated document
    // We only update specific fields allowed by the Controller
    return await File.findByIdAndUpdate(id, updateData, { new: true });
};

// DELETE a file/folder by ID
const deleteFile = async (id) => {
    return await File.findByIdAndDelete(id);
};

module.exports = {
    getFiles,
    getFileById,
    postFile,
    patchFile,
    deleteFile
};