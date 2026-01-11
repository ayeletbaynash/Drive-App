const Permission = require('../models/permissions')  // Permissions Model
const User = require('../models/users')   // User Model
const File = require('../models/files')        // File Model
const VALID_PERMISSIONS = ['read', 'write', 'owner']

const getPermissionRecursive = (fileId, userId) => {
    const permissionForUser = Permission.getPermissionForUser(fileId, userId)
    if (permissionForUser){
        return permissionForUser
    }
    const file = File.getFileById(fileId)
    if (file.parent_id === null) {
        return null
    }
    return getPermissionRecursive (file.parent_id, userId)
}





exports.getPermissionByFileId = (req, res) => {
    const userId = req.userId;
    
    const fileID = req.params.id
    if (!fileID) {
    return res.status(400).json({ error: 'Missing file ID in request parameters' })
}
    //check if the user is the owner that can update a premission
    const permissionForUser = getPermissionRecursive(fileID, userId)
    if (!permissionForUser) {
        return res.status(403).json({ error: 'User has no permission' })
}
    const permissions = Permission.getPermissions(fileID)
    const permissionsWithNames = permissions.map(p => {
        const user = User.getUserById(p.userID);
        return {
            ...p,
            username: user ? user.username : 'Unknown User'
        }
    })
    res.json(permissionsWithNames)
}

exports.postPermission = (req, res) => {
    const { username, permission } = req.body
    const fileID = req.params.id
    if (!fileID) {
    return res.status(400).json({ error: 'Missing file ID in request parameters' })
}
    if (!username || !permission) {
        return res.status(400).json({ error: 'Missing fields (username or permission)' });
}
    const currentUserId = req.userId;
    const targetUser = User.getUserByUsername(username); 
    if (!targetUser) {
        return res.status(404).json({ error: `User '${username}' not found` });
    }
    
    const userID = targetUser.id;

    //check if the permission is valid 
    if (!VALID_PERMISSIONS.includes(permission)) {
  return res.status(400).json({ error: 'Invalid permission type' })
}
    //check if the user is the owner that can create a premission
    const permissionForUser = Permission.getPermissionForUser(fileID, currentUserId)
    if (!permissionForUser) {
        return res.status(403).json({ error: 'User has no permission' })
}
    if (permissionForUser.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can change permissions' })
}

    //check if there is a permission alredy connected to this file and this user
    const permissionExists = Permission.getPermissionForUser(fileID, userID)
    if (permissionExists) {
        return res.status(400).json({ error: 'Permission already exists' })
}

    const newPerm = Permission.postPermission(fileID, userID, permission)
    res.status(201).json({
    pId: newPerm.pId 
})
}

exports.patchPermission = (req, res) => {
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

   const existingPermission = Permission.getPermissionsPid(pId)
   if (!existingPermission) {
        return res.status(404).json({ error: 'Permission not found' })
    }
    //check if the user is the owner that can update a premission
    const permissionForUser = Permission.getPermissionForUser(existingPermission.fileID, userId)
    if (!permissionForUser) {
        return res.status(403).json({ error: 'User has no permission' })
}
    if (permissionForUser.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can change permissions' })
}
    const isChanged = Permission.patchPermission(pId, permission)
    if (!isChanged) {//if pId not exsist
        return res.status(404).json({ error: 'pId not found' })
    }
    res.status(204).send()
}

exports.deletePermission = (req, res) => {
    const userId = req.userId;
    
    const pId = req.params.pId
    if (!pId) return res.status(400).json({ error: 'Missing permission ID in request parameters' })

    const existingPermission = Permission.getPermissionsPid(pId)
    if (!existingPermission) return res.status(404).json({ error: 'Permission not found' })

    //check if the user is the owner that can delete a premission
    const permissionForUser = Permission.getPermissionForUser(existingPermission.fileID, userId)
    if (!permissionForUser) {
        return res.status(403).json({ error: 'User has no permission' })
}
    if (permissionForUser.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can delete permissions' })
}
    const isDeleted = Permission.deletePermission(pId)
    if (!isDeleted) {
        return res.status(500).json({ error: 'Permission not found' })
    }
    res.status(204).send()
}