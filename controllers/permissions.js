const Permission = require('../models/permissions')


const VALID_PERMISSIONS = ['read', 'write', 'owner']

exports.getPermissionByFileId = (req, res) => {
    //need to check if there is a fileID!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //check how it write in the header!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userId = req.headers['user-id']
    const fileID = req.params.id
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
    const currentUserId = req.headers['user-id']
    //check all require fields are
    if ( !userID || !permission) {
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
        return res.status(400).json({ error: 'Permission already exists' })
}
     //need to check if there is a fileID!!!!!!!!!!!!!!!!!!!!!!!!!!! 
     //need to check if there is a userID!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    Permission.postPermission(fileID, userID, permission)
    res.sendStatus(201)
}

exports.patchPermission = (req, res) => {
    const { permission } = req.body
    const pId = req.params.pId
    //check all require fields are
    if (!permission) {
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