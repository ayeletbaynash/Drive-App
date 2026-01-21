const Permission = require('../models/permissions');

// GET all permissions for a file
const getPermissions = async (fileID) => {
    // Added populate to get user details (name, email, image) instead of just the ID.
    return await Permission.find({ file_id: fileID }).populate('user_id', 'username email image firstName');
};

// GET permission by PId
const getPermissionsPid = async (PId) => {
    return await Permission.findById(PId);
};

// POST new permission
const postPermission = async (fileID, userID, permission) => {
    const newPermission = new Permission({
        file_id: fileID,
        user_id: userID,
        permission: permission
    });
    return await newPermission.save();
};

// PATCH permission (update)
const patchPermission = async (pId, newPermissionType) => {
    // Mongoose returns the updated object if successful, or null if failed.
    // This works perfectly with if(result) checks in the controller.
    const result = await Permission.findByIdAndUpdate(
        pId,
        { permission: newPermissionType },
        { new: true } // Returns the updated document
    );
    return result; 
};

// DELETE permission
const deletePermission = async (pId) => {
    const result = await Permission.findByIdAndDelete(pId);
    return result; // Returns the deleted document or null
};

// GET permission for specific user and file
const getPermissionForUser = async (fileID, userID) => {
    return await Permission.findOne({ file_id: fileID, user_id: userID });
};

// GET permission by PId AND UserID (Security check)
const getPermissionForPId = async (pId, userID) => {
    return await Permission.findOne({ _id: pId, user_id: userID });
};

// Used to delete all permissions associated with a file when the file is deleted.
const deletePermissionsByFileId = async (fileId) => {
    return await Permission.deleteMany({ file_id: fileId });
};

module.exports = {
    getPermissions,
    getPermissionsPid,
    postPermission,
    patchPermission,
    deletePermission,
    getPermissionForUser,
    getPermissionForPId,
    deletePermissionsByFileId 
};