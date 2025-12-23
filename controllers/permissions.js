const Permission = require('../models/permissions')  // Permissions Model
const User = require('../models/users')   // User Model

const VALID_PERMISSIONS = ['read', 'write', 'owner']

exports.getPermissionByFileId = (req, res) => {
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    // check if user exist
    const user = User.getUserById(userId)
    if (!user) return res.status(401).json({ error: 'User does not exist' })
    
    const fileID = req.params.id
    if (!fileID) {
    return res.status(400).json({ error: 'Missing file ID in request parameters' })
}
    //check if the user is the owner that can update a premission
    const permissionForUser = Permission.getPermissionForUser(fileID, userId)
    if (!permissionForUser) {
        return res.status(403).json({ error: 'User has no permission' })
}
    if (permissionForUser.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can view permissions' })
}
    const permissions = Permission.getPermissions(fileID)
    res.json(permissions)
}

exports.postPermission = (req, res) => {
    const { userID, permission } = req.body
    const fileID = req.params.id
    if (!fileID) {
    return res.status(400).json({ error: 'Missing file ID in request parameters' })
}
    if ( !userID || !permission) {
        return res.status(400).json({ error: 'Missing fields' })
}
    const currentUserId = req.headers['user-id']
    if (!currentUserId) return res.status(401).json({ error: 'Missing user-id header' })

   const currentUser = User.getUserById(currentUserId)
    if (!currentUser) return res.status(401).json({ error: 'User does not exist' })
    
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

    const targetUser = User.getUserById(userID)
    if (!targetUser) return res.status(404).json({ error: 'Target user does not exist' })

    //check if there is a permission alredy connected to this file and this user
    const permissionExists = Permission.getPermissionForUser(fileID, userID)
    if (permissionExists) {
        return res.status(400).json({ error: 'Permission already exists' })
}

    Permission.postPermission(fileID, userID, permission)
    res.status(201).send()
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

    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    const user = User.getUserById(userId)
    if (!user) return res.status(401).json({ error: 'User does not exist' })

    const existingPermission = Permission.getPermissionByPId(pId)
    if (!existingPermission) {
        return res.status(404).json({ error: 'Permission not found' })
}
    //check if the user is the owner that can update a premission
    const permissionForUser = Permission.getPermissionForPId(pId, userId)
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
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    const user = User.getUserById(userId)
    if (!user) return res.status(401).json({ error: 'User does not exist' })
    
    const pId = req.params.pId
    if (!pId) return res.status(400).json({ error: 'Missing permission ID in request parameters' })

    const existingPermission = Permission.getPermissionByPId(pId)
    if (!existingPermission) return res.status(404).json({ error: 'Permission not found' })

    //check if the user is the owner that can delete a premission
    const permissionForUser = Permission.getPermissionForPId(pId, userId)
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