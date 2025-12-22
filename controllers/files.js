const Client = require('../Client')   // check what is the right route!!!!!!!!!!!!!
const File = require('../models/files')        // File Model (in-memory)
const Permission = require('../models/permissions') // Permission Model (in-memory)

// GET /api/files - Retrieve all files/folders for the connected user.
// Includes files owned by the user or files where the user has any permission.
exports.getFiles = (req, res) => {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })

    // Filter files: include owned files and files with any permission
    const files = File.getFiles().filter(f => {
        if (f.user_id === userId) return true; // Owner always sees
        const perm = Permission.getPermissionForUser(f.id, userId);
        return perm !== undefined; // Include if any permission exists
    })

    res.status(200).json(files); // Return JSON response
}

// GET /api/files/:id - Retrieve a single file/folder by ID for the connected user.
exports.getFileById = async (req, res) => {
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    
    const fileId = Number(req.params.id)

    const file = File.getFileById(fileId)
    if (!file) {
        return res.status(404).json({ error: 'File not found' })
    }

    // Permission check: owner or any permission
    if (file.user_id !== userId) {
        const perm = Permission.getPermissionForUser(fileId, userId);
        if (!perm) return res.status(403).json({ error: 'No permission to access this file' });
    }

    // Folder means no TCP call
    if (file.type === 'folder') {
        return res.status(200).json(file)
    }

    // File means get content from TCP server
    try {
        const client = new Client('127.0.0.1', 5000)

        const response = await client.sendAndReceive(
            `GET ${file.id}`
        )

        client.close()

        if (!response.startsWith('200')) {
            return res.status(404).json({ error: 'File content not found' })
        }

        // response format
        const content = response.split('\n\n').slice(1).join('\n\n')

        res.status(200).json({
            ...file,
            content
        })

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve file content' })
    }

}

// POST /api/files - Create a new file or folder.
exports.postFile = async (req, res) => {
    const userId = req.headers['user-id']
    if (!userId) {
        return res.status(401).json({ error: 'Missing user-id header' })
    }

    const { display_name, type, content = null, parent_id = null } = req.body

    // Validate required fields
    if (!display_name || !type) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    // Folder must NOT have content
    if (type === 'folder' && content !== null) {
        return res.status(400).json({ error: 'Folder cannot have content' })
    }

    // File MUST have content
    if (type === 'file' && !content) {
        return res.status(400).json({ error: 'File must have content' })
    }

    // Validate parent folder permission (if parent_id provided)
    if (parent_id !== null) {
        const pId = Number(parent_id)
        const parent = File.getFileById(pId);
        const perm = Permission.getPermissionForUser(pId, userId);
        if (!parent || parent.type !== 'folder' || !perm || !['write', 'owner'].includes(perm.permission)) {
            return res.status(403).json({ error: 'No permission to add file to this folder' });
        }
    }

    try {
        // Create the file/folder in memory
        const newFile = File.postFile({
            user_id: userId,
            display_name,
            type,
            parent_id
        })

        // Automatically give the owner permission to the file
        Permission.postPermission(newFile.id, userId, 'owner')

        // If it's a file – store content in TCP server
        if (type === 'file') {
            const client = new Client('127.0.0.1', 5000)
            const response = await client.sendAndReceive(
                `POST ${newFile.id} ${content}`
            )
            client.close()

            if (!response.startsWith('201')) {
                return res.status(500).json({ error: 'Failed to store file content' })
            }
        }

        res.status(201).json(newFile)

    } catch (err) {
        // Catch validation errors from FileModel
        res.status(400).json({ error: err.message })
    }
}

// PATCH /api/files/:id - Update an existing file/folder.
// Only users with 'write' or 'owner' permission can update.
exports.patchFile = async (req, res) => {
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    
    const fileId = Number(req.params.id)
    const data = req.body

    const file = File.getFileById(fileId)
    if (!file) {
        return res.status(404).json({ error: 'File not found' })
    }

    // Permission check: only 'write' or 'owner' can edit
    const permission = Permission.getPermissionForUser(fileId, userId)
    if (!permission || !['write', 'owner'].includes(permission.permission)) {
        return res.status(403).json({ error: 'No permission to edit this file' })
    }

    // Validate that at least one allowed field is present
    const allowedFields = ['display_name', 'parent_id', 'content']
    const hasValidField = allowedFields.some(f => f in data)
    if (!hasValidField) {
        return res.status(400).json({ error: 'No valid fields provided for update' })
    }

    // Prevent circular references
    if (data.parent_id && Number(data.parent_id) === file.id) {
        return res.status(400).json({ error: 'Cannot move a folder into itself' });
    }

    // Check parent folder permission if moving
    if (data.parent_id) {
        const newParent = File.getFileById(data.parent_id);
        const parentPerm = Permission.getPermissionForUser(data.parent_id, userId);
        if (!newParent || !parentPerm || !['write', 'owner'].includes(parentPerm.permission)) {
            return res.status(403).json({ error: 'No permission to move file into target folder' });
        }
    }

    try {
        // Update content on TCP server
        const client = new Client('127.0.0.1', 5000) // התחברות לשרת TCP

        // Delete existing file from TCP server
        const deleteResponse = await client.sendAndReceive(`delete ${file.id}`)
        if (!deleteResponse.startsWith('204')) {
            client.close()
            return res.status(500).json({ error: 'Failed to update file content on storage server' })
        }

        // Add file again with new content (if provided)
        if (data.content) {
            const addResponse = await client.sendAndReceive(`add ${file.id} ${data.content.replace(/\n/g, '\x04')}`)
            if (!addResponse.startsWith('201')) {
                client.close()
                return res.status(500).json({ error: 'Failed to update file content on storage server' })
            }
        }

        client.close()
        // Update local model details
        const updated = File.patchFile(fileId, data)
        if (!updated) {
            return res.status(400).json({ error: 'Local update failed' })
        }

        res.status(200).json({ message: 'File updated' })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE /api/files/:id - Delete a file/folder and all its children recursively (if folder).
// Only 'owner' can delete. Also removes all permissions to avoid memory leaks.
exports.deleteFile = async (req, res) => {
    const userId = req.headers['user-id']
    if (!userId) return res.status(401).json({ error: 'Missing user-id header' })
    
    const fileId = Number(req.params.id)

    const file = File.getFileById(fileId)
    if (!file) {
        return res.status(404).json({ error: 'File not found' })
    }

    // Permission check: only 'owner' can delete
    const permission = Permission.getPermissionForUser(fileId, userId)
    if (!permission || permission.permission !== 'owner') {
        return res.status(403).json({ error: 'Only owner can delete this file' })
    }

    // TCP server communication
    const client = new Client('127.0.0.1', 5000)

    try {
        const message = `DELETE ${fileId}`
        const response = await client.sendAndReceive(message)

        if (!response.startsWith('204')) {
            // TCP server rejected deletion
            return res.status(500).json({error: 'Failed to delete file from storage server'})
        }

    // Recursive deletion helper: deletes file/folder and its children + permissions
    const recursiveDelete = (id) => {
        const children = File.getFiles().filter(f => f.parent_id === id)
        for (const child of children) {
            recursiveDelete(child.id)
        }
        // Delete permissions of this file
        const perms = Permission.getPermissions(id)
        perms.forEach(p => Permission.deletePermission(p.pId))
        // Delete the file itself
        File.deleteFile(id)
    }

    recursiveDelete(fileId)

    res.status(204).send() // No content

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    } finally {
        client.close()
    }
}