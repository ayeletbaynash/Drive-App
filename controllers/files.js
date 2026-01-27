const Client = require('../client')   // Client
const fileService = require('../services/files'); // File Service (MongoDB)
const permissionService = require('../services/permissions'); // Permission Service
const userService = require('../services/users');
const crypto = require('crypto')  // for the pysical name


const getPermissionRecursive = async (fileId, userId) => {
    // Check direct permission on this file
    const permissionForUser = await permissionService.getPermissionForUser(fileId, userId)  // changed name of fintion check later!!!  getPermission 
    if (permissionForUser){
        return permissionForUser
    }
    // Get the file to check parent
    const file = await fileService.getFileById(fileId)
    if (!file || !file.parent_id) {
        return null     // Root reached or file not found
    }
    // Recursive call on parent
    return await getPermissionRecursive(file.parent_id, userId)
};

// GET /api/files - Retrieve top-level (root) files/folders
exports.getFiles = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Optimization: Get only root files first from DB
        const allRootFiles = await fileService.getFiles({ parent_id: null });

        // Filter files: include owned files and files with any permission
        const filesWithPermissions = await Promise.all(allRootFiles.map(async (f) => {
            let permissionLevel = null;

            if (f.user_id.toString() === userId) {
                permissionLevel = 'owner';
            } else {
            const perm = await getPermissionRecursive(f._id, userId);
            if (perm) {
                    permissionLevel = perm.permission;
                }
            }

            if (!permissionLevel) return null;

            const fileObj = f.toObject(); // Convert Mongoose document to a plain JavaScript object
            fileObj.id = fileObj._id;     // Map '_id' (MongoDB standard) to 'id' (Frontend expectation)
            delete fileObj._id;           // Remove '_id' to keep the object clean

            fileObj.permission = permissionLevel;

            if (permissionLevel !== 'owner') {
                const owner = await userService.getUserById(f.user_id);
                fileObj.ownerName = owner ? owner.username : 'Unknown'; // או owner.emailAddress
            }

            return fileObj;
        }));

        const responseFiles = filesWithPermissions.filter(f => f !== null);

        res.status(200).json(responseFiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/files/:id - Retrieve a single file/folder by ID
exports.getFileById = async (req, res) => {
    try {
        const userId = req.userId;
        const fileId = req.params.id;

        const file = await fileService.getFileById(fileId)
        if (!file) {
            return res.status(404).json({ error: 'File not found' })
        }

        // Permission check: owner or any permission
        if (file.user_id.toString() !== userId) {
            const perm = await getPermissionRecursive(fileId, userId);
            if (!perm) return res.status(403).json({ error: 'No permission to access this file' });
        }

        // Folder means no TCP call -> get children
        if (file.type === 'folder') {
            const children = await fileService.getFiles({ parent_id: fileId })

            const childrenWithDetails = await Promise.all(children.map(async (child) => {
                const childObj = child.toObject();
                
                childObj.id = childObj._id;
                delete childObj._id;

                let permissionLevel = 'read'; 
                if (child.user_id.toString() === userId) {
                    permissionLevel = 'owner';
                } else {
                    const perm = await getPermissionRecursive(child._id, userId);
                    if (perm) permissionLevel = perm.permission;
                }
                childObj.permission = permissionLevel;

                if (permissionLevel === 'owner') {
                    const me = await userService.getUserById(child.user_id);
                    childObj.ownerName = me ? me.username : 'Unknown';
                } else {
                    const owner = await userService.getUserById(child.user_id);
                    childObj.ownerName = owner ? owner.username : 'Unknown';
                }

                return childObj;
            }));

            const responseObj = file.toObject();
            responseObj.id = responseObj._id;
            delete responseObj._id;

            return res.status(200).json({
                ...responseObj,
                children: childrenWithDetails
            });
        }

        // File means get content from TCP server
        const client = new Client();
        try {
            const response = await client.sendAndReceive(`GET ${file.physicalName}`)
            //client.close()

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

            const fileObj = file.toObject();
            fileObj.id = fileObj._id;
            delete fileObj._id;

            res.status(200).json({
                ...fileObj,
                content
            });
        } finally {
            client.close();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
};

// POST /api/files - Create a new file or folder.
exports.postFile = async (req, res) => {
    try {
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
        if (parent_id) {
            // const parentId = Number(parent_id)
            const parent = await fileService.getFileById(parent_id);
            const perm = await getPermissionRecursive(parent_id, userId);

            if (!parent || parent.type !== 'folder' || !perm || !['write', 'owner'].includes(perm.permission)) {
                return res.status(403).json({ error: 'No permission to add file to this folder' });
            }
        }

        const physicalName = type === 'file' ? crypto.randomUUID() : null;

        // Create the file/folder in memory
        const newFile = await fileService.postFile({
            user_id: userId,
            name,
            physicalName,
            type,
            parent_id: parent_id || null
        })

        // automatically give the owner permission to the file
        await permissionService.postPermission(newFile._id, userId, 'owner')  

        // if it's a file – store content in TCP server
        if (type === 'file') {
            const client = new Client()
            try {
                //change to base 64 to allowed a lot of row in a file
                const encodedContent = Buffer.from(content || '', 'utf-8').toString('base64');
                const response = await client.sendAndReceive(
                    `POST ${newFile.physicalName} ${encodedContent}`
                )
                // client.close()

                //split response into lines
                const [statusLine, ...rest] = response.split('\n')
                // work with status line
                const [statusCodeStr, ...statusMessageParts] = statusLine.split(' ')
                const statusCode = Number(statusCodeStr)
                const statusMessage = statusMessageParts.join(' ')
                if (statusCode !== 201) {
                    // Rollback: If TCP fails, delete the file from MongoDB
                    await fileService.deleteFile(newFile._id);
                    return res.status(statusCode).json({error: statusMessage})
                }   
            } finally {
                client.close();
            }
        }
        
        res.location(`/api/files/${newFile._id}`)
        res.status(201).json({id: newFile._id})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH /api/files/:id - Update an existing file/folder.
// Only users with 'write' or 'owner' permission can update.
exports.patchFile = async (req, res) => {
    try {
        const userId = req.userId;
        const fileId = req.params.id;
        const data = req.body;

        const file = await fileService.getFileById(fileId)
        if (!file) {
            return res.status(404).json({ error: 'File not found' })
        }

        // Permission check: only 'write' or 'owner' can edit
        const permission = await getPermissionRecursive(fileId, userId)
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
        if (data.parent_id && data.parent_id == file._id.toString()) {
            return res.status(400).json({ error: 'Cannot move a folder into itself' });
        }

        // Check parent folder permission if moving
        if (data.parent_id) {
            const newParent = await fileService.getFileById(data.parent_id);
            const parentPerm = await getPermissionRecursive(data.parent_id, userId);
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
                //const [codeStr, ...msgParts] = statusLine.split(' ')
                const statusCode = Number(statusLine.split(' ')[0])
                //const statusMessage = msgParts.join(' ')

                if (statusCode !== 204) {
                    //client.close()
                    return res.status(statusCode).json({ error: 'TCP Delete failed' })
                }

                //change to base64
                const encodedContent = Buffer.from(data.content, 'utf-8').toString('base64');

                // Add file again with new content (if provided)
                const addResponse = await client.sendAndReceive(`POST ${file.physicalName} ${encodedContent}`)
                const [addStatusLine] = addResponse.split('\n')
                //const [addCodeStr, ...addMsgParts] = addStatusLine.split(' ')
                const addStatusCode = Number(addStatusLine.split(' ')[0])
                //const addStatusMessage = addMsgParts.join(' ')

                if (addStatusCode !== 201) {
                    //client.close()
                    return res.status(addStatusCode).json({ error: 'TCP Write failed' })
                }
            } finally {
                client.close() 
            }
        }

        if(data.name || data.parent_id !== undefined || data.content !== undefined){
            // Service handles updatedAt automatically via Mongoose timestamps
            const updated = await fileService.patchFile(fileId, data)
            if (!updated) {
                return res.status(400).json({ error: 'Local update failed' })
            }
        }

        res.status(204).json()  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/files/:id - Delete a file/folder and all its children recursively (if folder).
// Only 'owner' can delete. Also removes all permissions to avoid memory leaks.
exports.deleteFile = async (req, res) => {
    try {
        const userId = req.userId;
        const fileId = req.params.id

        const file = await fileService.getFileById(fileId)
        if (!file) return res.status(404).json({ error: 'File not found' })

        // Permission check: only 'owner' can delete
        const permission = await permissionService.getPermissionForUser(fileId, userId) 
        if (!permission || permission.permission !== 'owner') {
            return res.status(403).json({ error: 'Only owner can delete this file' })
        }

        // Open one TCP client for all deletions
        const client = new Client()

        try {
            // recursive deletion helper
            const recursiveDelete = async (id) => {
                const current = await fileService.getFileById(id)
                if (!current) return;

                // delete children first
                const children = await fileService.getFiles({ parent_id: id })
                for (const child of children) {
                    await recursiveDelete(child._id)
                }

                //if this is a file, delete on TCP server
                if (current.type === 'file') {
                    try {
                        const message = `DELETE ${current.physicalName}`
                        const deleteResponse = await client.sendAndReceive(message)

                        const [statusLine] = deleteResponse.split('\n')
                        if (!statusLine.startsWith('204')) {
                            console.warn(`TCP Delete warning for ${current.physicalName}: ${statusLine}`);
                        }
                    } catch (tcpErr) {
                        console.error("TCP Connection failed during delete:", tcpErr);
                    }
                }

                //Delete permissions of this file/folder from DB
                await permissionService.deletePermissionsByFileId(id);
                
                // delete the file/folder itself in the model
                await fileService.deleteFile(id)
            }

            //start recursive deletion from the root file/folder
            await recursiveDelete(fileId)
            res.status(204).send() 
        } finally {
            client.close()
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
