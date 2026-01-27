const permissionService = require('../services/permissions'); // Updated to use Service
const userService = require('../services/users'); // Updated to use Service
const fileService = require('../services/files'); // Updated to use Service

const VALID_PERMISSIONS = ['read', 'write', 'owner']

// Helper function to check permissions up the tree
const getPermissionRecursive = async (fileId, userId) => {
    // Check direct permission on this file
    const permissionForUser = await permissionService.getPermissionForUser(fileId, userId)
    if (permissionForUser){
        return permissionForUser;
    }
    // Get the file to check parent
    const file = await fileService.getFileById(fileId)
    if (!file || !file.parent_id) {
        return null;  // Root reached or file not found
    }
    // Recursive call on parent
    return await getPermissionRecursive(file.parent_id, userId)
};

exports.getPermissionByFileId = async (req, res) => {
    try {
        const userId = req.userId;
        const fileID = req.params.id;

        if (!fileID) {
        return res.status(400).json({ error: 'Missing file ID in request parameters' })
        }

        //check if the user is the owner that can update a premission
        const permissionForUser = await getPermissionRecursive(fileID, userId)
        if (!permissionForUser) {
            return res.status(403).json({ error: 'User has no permission' })
        }

        // Get permissions from DB
        const permissions = await permissionService.getPermissions(fileID)
        const permissionsWithNames = await Promise.all(permissions.map(async (p) => {
            const uid = p.user_id._id || p.user_id || p.userID;
            
            let username = 'Unknown User';
            try {
                const user = await userService.getUserById(uid);
                if (user) username = user.username;
            } catch (err) {
                console.log("Error fetching user name:", err.message);
            }

            return {
                ...p.toObject(),
                pId: p._id,
                username: username
            };
        }));

        res.json(permissionsWithNames);
    } catch (error) {
        console.error("Get Permissions Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.postPermission = async (req, res) => {
    try {
        const { username, permission } = req.body
        const fileID = req.params.id

        if (!fileID) {
        return res.status(400).json({ error: 'Missing file ID in request parameters' })
        }
        if (!username || !permission) {
            return res.status(400).json({ error: 'Missing fields (username or permission)' });
        }

        const currentUserId = req.userId;

        // Find user by username using Service
        const targetUser = await userService.getUserByUsername(username); 
        if (!targetUser) {
            return res.status(404).json({ error: `User '${username}' not found` });
        }
        
        const userID = targetUser._id;

        //check if the permission is valid 
        if (!VALID_PERMISSIONS.includes(permission)) {
            return res.status(400).json({ error: 'Invalid permission type' })
        }

        //check if the user is the owner that can create a premission
        const permissionForUser = await permissionService.getPermissionForUser(fileID, currentUserId)
        if (!permissionForUser) {
            return res.status(403).json({ error: 'User has no permission' })
        }
        if (permissionForUser.permission !== 'owner') {
            return res.status(403).json({ error: 'Only owner can change permissions' })
        }

        //check if there is a permission alredy connected to this file and this user
        const permissionExists = await permissionService.getPermissionForUser(fileID, userID)
        if (permissionExists) {
            return res.status(400).json({ error: 'Permission already exists' })
        }

        const newPerm = await permissionService.postPermission(fileID, userID, permission)
        res.status(201).json({
            pId: newPerm._id 
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.patchPermission = async (req, res) => {
    try {
        const { permission } = req.body
        if (!permission) {
            return res.status(400).json({ error: 'Missing fields' })
        }

        const pId = req.params.pId
        if (!pId) {
        return res.status(400).json({ error: 'Missing permission ID in request parameters' })
        }

        //check if the permission is valid 
        if (!VALID_PERMISSIONS.includes(permission)) {
            return res.status(400).json({ error: 'Invalid permission type' })
        }

        const userId = req.userId;

    const existingPermission = await permissionService.getPermissionsPid(pId)
    if (!existingPermission) {
            return res.status(404).json({ error: 'Permission not found' })
        }
        //check if the user is the owner that can update a premission
        const permissionForUser = await permissionService.getPermissionForUser(existingPermission.file_id, userId)
        if (!permissionForUser) {
            return res.status(403).json({ error: 'User has no permission' })
        }
        if (permissionForUser.permission !== 'owner') {
            return res.status(403).json({ error: 'Only owner can change permissions' })
        }

        const updatedPerm = await permissionService.patchPermission(pId, permission)
        if (!updatedPerm) {   //if pId not exsist
            return res.status(404).json({ error: 'Failed to update permission' })
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        const userId = req.userId;
        const pId = req.params.pId;

        if (!pId) return res.status(400).json({ error: 'Missing permission ID in request parameters' })

        const existingPermission = await permissionService.getPermissionsPid(pId)
        if (!existingPermission) return res.status(404).json({ error: 'Permission not found' })

        //check if the user is the owner that can delete a premission
        const permissionForUser = await permissionService.getPermissionForUser(existingPermission.file_id, userId)
        if (!permissionForUser) {
            return res.status(403).json({ error: 'User has no permission' })
        }
        if (permissionForUser.permission !== 'owner') {
            return res.status(403).json({ error: 'Only owner can delete permissions' })
        }

        const deletedPerm = await permissionService.deletePermission(pId)
        if (!deletedPerm) {
            return res.status(500).json({ error: 'Failed to delete permission' })
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};