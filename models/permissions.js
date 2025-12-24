let pIdCounter = 0
const all_permissions = []

const getPermissions = (fileID) => all_permissions.filter(p => p.fileID == fileID)

const postPermission = (fileID, userID, permission) => {
    const newPermission = { pId: pIdCounter++, fileID, userID, permission}
    all_permissions.push(newPermission)
    return newPermission
}

const patchPermission = (pId, newPermission) => {
    const index = all_permissions.findIndex(p => p.pId == pId)
    if (index !== -1) {
        all_permissions[index].permission = newPermission
        return true
    }
    return false
}

const deletePermission = (pId) => {
    const index = all_permissions.findIndex(p => p.pId == pId)
    if (index !== -1) {
        all_permissions.splice(index, 1) 
        return true
    }
    return false
}
const getPermissionForUser = (fileID, userID) => {
  return all_permissions.find(
    p => p.fileID == fileID && p.userID == userID
  )
}

const getPermissionForPId = (pId, userID) => {
  return all_permissions.find(
    p => p.pId == pId && p.userID == userID
  )
}




module.exports = {
    getPermissions,
    postPermission,
    patchPermission,
    deletePermission,
    getPermissionForUser,
    getPermissionForPId
}