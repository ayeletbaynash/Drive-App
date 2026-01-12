const Client = require('../client')   // Client
const File = require('../models/files')        // File Model (in-memory)
const Permission = require('../models/permissions') // Permission Model (in-memory)
const User = require('../models/users')   // User Model
const crypto = require('crypto')  // for the pysical name


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

// GET /api/files - Retrieve top-level (root) files/folders for the connected user
exports.getFiles = (req, res) => {
    const userId = req.userId;
    // Filter files: include owned files and files with any permission
    const files = File.getFiles().filter(f => {
        if (f.parent_id !== null) return false
        if (f.user_id == userId) return true; // Owner always sees
        const perm = getPermissionRecursive(f.id, userId)
        return perm !== null // Include if any permission exists
    })

    res.status(200).json(files) // Return JSON response
}

// GET /api/files/:id - Retrieve a single file/folder by ID for the connected user.
exports.getFileById = async (req, res) => {
    const userId = req.userId;

    const fileId = Number(req.params.id)

    const file = File.getFileById(fileId)
    if (!file) {
        return res.status(404).json({ error: 'File not found' })
    }

    // Permission check: owner or any permission
    if (file.user_id !== userId) {
        const perm = getPermissionRecursive(fileId, userId);
        if (!perm) return res.status(403).json({ error: 'No permission to access this file' });
    }

    // Folder means no TCP call
    if (file.type === 'folder') {
        const children = File.getFiles().filter(f => f.parent_id == fileId)

        return res.status(200).json({
            ...file,
            children
        }
        )
    }

    // File means get content from TCP server
    const client = new Client()

    const response = await client.sendAndReceive(`GET ${file.physicalName}`)
    client.close()

    //split response into lines
    const [statusLine, ...rest] = response.split('\n')

    // work with status line
    const [statusCodeStr, ...statusMessageParts] = statusLine.split(' ')
    const statusCode = Number(statusCodeStr)
    const statusMessage = statusMessageParts.join(' ')

    // if not 200 – forward error from C++ server
    if (statusCode !== 200) {
        return res.status(statusCode).json({
            error: statusMessage
        })
    }

    // if 200- content
    const encodedContent = rest.join('')
    const content = Buffer.from(encodedContent, 'base64').toString('utf-8');
    res.status(200).json({
        ...file,
        content
    })
}

// POST /api/files - Create a new file or folder.
exports.postFile = async (req, res) => {
    const userId = req.userId;

    const { name, type, content = null, parent_id = null } = req.body

    // Validate required fields
    if (!name || !type) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    // Folder must NOT have content
    if (type === 'folder' && content !== null) {
        return res.status(400).json({ error: 'Folder cannot have content' })
    }

    // Validate parent folder permission (if parent_id provided)
    if (parent_id !== null) {
        const parentId = Number(parent_id)
        const parent = File.getFileById(parentId);
        const perm = getPermissionRecursive(parentId, userId);
        if (!parent || parent.type !== 'folder' || !perm || !['write', 'owner'].includes(perm.permission)) {
            return res.status(403).json({ error: 'No permission to add file to this folder' });
        }
    }

    const physicalName = type === 'file' ? crypto.randomUUID() : null;

    // Create the file/folder in memory
    const newFile = File.postFile({
        user_id: userId,
        name,
        physicalName,
        type,
        parent_id
    })

    // automatically give the owner permission to the file
    Permission.postPermission(newFile.id, userId, 'owner')

    // if it's a file – store content in TCP server
    if (type === 'file') {
        const client = new Client()
        //change to base 64 to allowed a lot of row in a file
        const encodedContent = Buffer.from(content || '', 'utf-8').toString('base64');
        const response = await client.sendAndReceive(
            `POST ${newFile.physicalName} ${encodedContent}`
        )
        client.close()

         //split response into lines
        const [statusLine, ...rest] = response.split('\n')
        // work with status line
        const [statusCodeStr, ...statusMessageParts] = statusLine.split(' ')
        const statusCode = Number(statusCodeStr)
        const statusMessage = statusMessageParts.join(' ')
        if (statusCode !== 201) {
            return res.status(statusCode).json({
            error: statusMessage
        })
    }   
}
    res.location(`/api/files/${newFile.id}`)
    res.status(201).json({
    id: newFile.id
})
}

// PATCH /api/files/:id - Update an existing file/folder.
// Only users with 'write' or 'owner' permission can update.
exports.patchFile = async (req, res) => {
    const userId = req.userId;

    const fileId = Number(req.params.id)
    const data = req.body

    const file = File.getFileById(fileId)
    if (!file) {
        return res.status(404).json({ error: 'File not found' })
    }

    // Permission check: only 'write' or 'owner' can edit
    const permission = getPermissionRecursive(fileId, userId)
    if (!permission || !['write', 'owner'].includes(permission.permission)) {
        return res.status(403).json({ error: 'No permission to edit this file' })
    }

    // Validate that at least one allowed field is present
    const allowedFields = ['name', 'parent_id', 'content']
    const hasValidField = allowedFields.some(f => f in data)
    if (!hasValidField) {
        return res.status(400).json({ error: 'No valid fields provided for update' })
    }

    // Prevent circular references
    if (data.parent_id && Number(data.parent_id) == file.id) {
        return res.status(400).json({ error: 'Cannot move a folder into itself' });
    }

    // Check parent folder permission if moving
    if (data.parent_id) {
        const newParent = File.getFileById(data.parent_id);
        const parentPerm = getPermissionRecursive(data.parent_id, userId);
        if (!newParent || !parentPerm || !['write', 'owner'].includes(parentPerm.permission)) {
            return res.status(403).json({ error: 'No permission to move file into target folder' });
        }
    }

    if (data.content !== undefined){
        // Update content on TCP server
        const client = new Client() 
        try {
            // Delete existing file from TCP server
            const deleteResponse = await client.sendAndReceive(`DELETE ${file.physicalName}`)
            const [statusLine] = deleteResponse.split('\n')
            const [codeStr, ...msgParts] = statusLine.split(' ')
            const statusCode = Number(codeStr)
            const statusMessage = msgParts.join(' ')

            if (statusCode !== 204) {
                client.close()
                return res.status(statusCode).json({ error: statusMessage })
            }

            //change to base64
            const encodedContent = Buffer.from(data.content, 'utf-8').toString('base64');

            // Add file again with new content (if provided)
            const addResponse = await client.sendAndReceive(`POST ${file.physicalName} ${encodedContent}`)
            const [addStatusLine] = addResponse.split('\n')
            const [addCodeStr, ...addMsgParts] = addStatusLine.split(' ')
            const addStatusCode = Number(addCodeStr)
            const addStatusMessage = addMsgParts.join(' ')

            if (addStatusCode !== 201) {
                client.close()
                return res.status(addStatusCode).json({ error: addStatusMessage })
            }

    }finally {
        client.close() 
    }
}
    if(data.name || data.parent_id || data.content !== undefined){
        data.updated_at = new Date().toISOString()
        // Update local model details
        const updated = File.patchFile(fileId, data)
        if (!updated) {
            return res.status(400).json({ error: 'Local update failed' })
        }
    }
        res.status(204).json()  
}
// DELETE /api/files/:id - Delete a file/folder and all its children recursively (if folder).
// Only 'owner' can delete. Also removes all permissions to avoid memory leaks.
exports.deleteFile = async (req, res) => {
    const userId = req.userId;

    const fileId = Number(req.params.id)
    const file = File.getFileById(fileId)
    if (!file) return res.status(404).json({ error: 'File not found' })

    // Permission check: only 'owner' can delete
    const permission = Permission.getPermissionForUser(fileId, userId)
    if (!permission || permission.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can delete this file' })
    }

    // Open one TCP client for all deletions
    const client = new Client()

    try {
        // recursive deletion helper
        const recursiveDelete = async (id) => {
            const current = File.getFileById(id)

            // delete children 
            const children = File.getFiles().filter(f => f.parent_id == id)
            for (const child of children) {
                await recursiveDelete(child.id)
            }

            //if this is a file, delete on server
            if (current.type === 'file') {
                const message = `DELETE ${current.physicalName}`
                const deleteResponse = await client.sendAndReceive(message)

                const [statusLine] = deleteResponse.split('\n')
                const [codeStr, ...msgParts] = statusLine.split(' ')
                const statusCode = Number(codeStr)
                const statusMessage = msgParts.join(' ')
                if (statusCode !== 204) {
                    client.close()
                    return res.status(statusCode).json({ error: statusMessage })
                }
            }

            //Delete permissions of this file/folder
            const perms = Permission.getPermissions(id)
            perms.forEach(p => Permission.deletePermission(p.pId))

            // delete the file/folder itself in the model
            File.deleteFile(id)
        }

        //start recursive deletion from the root file/folder
        await recursiveDelete(fileId)

        res.status(204).send() 
    } finally {
        client.close()
    }
}
