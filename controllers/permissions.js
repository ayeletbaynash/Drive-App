const Permission = require('../models/permissions')


const VALID_PERMISSIONS = ['read', 'write', 'owner']

exports.getPermissionByFileId = (req, res) => {
    //need to check if there is a fileID!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const permissions = Permission.getPermissions(parseInt(req.params.fileID))
    res.json(permissions)
}

exports.postPermission = (req, res) => {
    const { fileID, userID, permission } = req.body
    const currentUserId = req.headers['user-id']
    //check all require fields are
    if (!fileID || !userID || !permission) {
        return res.status(400).json({ error: 'Missing fields' })
}
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

//chek if there is a permission alredy connected to this file and this user
    const permissionExists = Permission.getPermissionForUser(fileID, userID)
    if (permissionExists) {
        return res.status(400).json({ error: 'permission alredy exsist' })
}
     //need to check if there is a fileID!!!!!!!!!!!!!!!!!!!!!!!!!!! 
     //need to check if there is a userID!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    Permission.postPermission(fileID, userID, permission)
    res.sendStatus(201)
}

exports.patchPermission = (req, res) => {
    const { pId, permission } = req.body
    //check all require fields are
    if (!pId || !permission) {
        return res.status(400).json({ error: 'Missing fields' })
}
//check if the permission is valid 
    if (!VALID_PERMISSIONS.includes(permission)) {
        return res.status(400).json({ error: 'Invalid permission type' })
}
    //check how it write in the header!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userId = req.headers['user-id']
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
    //check how it write in the header!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userId = req.headers['user-id']
    const pId = req.params.pId
        if (!pId) {
        return res.status(400).json({ error: 'Missing field' })
}
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
        return res.status(404).json({ error: 'Permission not found' })
    }
    res.status(204).send()
}