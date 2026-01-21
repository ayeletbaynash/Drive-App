const Client = require('../client');
const fileService = require('../services/files'); // Use File Service
const permissionService = require('../services/permissions'); // Use Permission Service

// Helper: Check permissions recursively (Copied from files controller for consistency)
const getPermissionRecursive = async (fileId, userId) => {
    const permissionForUser = await permissionService.getPermissionForUser(fileId, userId);
    if (permissionForUser) {
        return permissionForUser;
    }
    const file = await fileService.getFileById(fileId);
    if (!file) {
        return null; 
    }
    if (file.user_id.toString() === userId) {
        return { permission: 'owner' }; 
    }
    if (!file.parent_id) {
        return null; 
    }
    return await getPermissionRecursive(file.parent_id, userId);
};

const search = async (req, res) => {
    try {
        const query = req.params.query; 
        const userId = req.userId;
        
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const results = []; 
        const processedFileIds = new Set();

        const addToResults = (file, permission) => {
            const fileObj = file.toObject(); 
            fileObj.id = fileObj._id;        
            delete fileObj._id;              
            fileObj.permission = permission; 
            
            results.push(fileObj);
            processedFileIds.add(fileObj.id.toString());
        };

        // Fetch files where name matches query (Case Insensitive)
        const nameMatches = await fileService.getFiles({
            name: { $regex: query, $options: 'i' } 
        });

        for (const file of nameMatches) {
            try {
                // Check if user is owner
                if (file.user_id.toString() === userId) {
                    addToResults(file, 'owner'); 
                    continue;
                }

                // Protection in case permissions are missing or object is incomplete
                const perm = await getPermissionRecursive(file._id, userId);
                if (perm) { 
                     addToResults(file, perm.permission || 'read');
                }
            } catch (e) {
                // Ignore errors for individual files
            }
        }

        // Attempt to contact C++ 
        let client = null;
        try {
            client = new Client(); 
            // Try to talk to C++. If it throws an error - we catch it below
            const response = await client.sendAndReceive(`search ${query}`); 
            
            if (response) {
                const lines = response.split('\n');
                const statusLine = lines[0] ? lines[0].trim() : "";
                const statusCode = statusLine ? Number(statusLine.split(' ')[0]) : 500;

                if (statusCode === 200) {
                    const resultLine = lines[2] ? lines[2].trim() : "";
                    const physicalNames = resultLine ? resultLine.split(' ') : [];
                    
                    for (const pName of physicalNames) {
                        const cleanPName = pName.trim();
                        if (!cleanPName) continue;

                        // Convert from physical name to logical name
                        const filesFound = await fileService.getFiles({ physicalName: cleanPName });
                        const file = filesFound[0];
                        
                        // If we found a file and haven't added it yet
                        if (file && !processedFileIds.has(file._id.toString())) {

                            // Check Permissions
                            let permissionType = null;
                            if (file.user_id.toString() === userId) {
                                permissionType = 'owner';
                            } else {
                                const perm = await getPermissionRecursive(file._id, userId);
                                if (perm) permissionType = perm.permission;
                            }

                            if (permissionType) {
                                try {
                                    const contentResponse = await client.sendAndReceive(`GET ${cleanPName}`);
                                    const contentLines = contentResponse.split('\n');
                                    // Assuming content starts from line 3 (index 2) onwards
                                    const encodedContent = contentLines.slice(2).join('\n');

                                    if (encodedContent) {
                                        const content = Buffer.from(encodedContent, 'base64').toString('utf-8');
                                        // Check if query is truly in the content (Case Insensitive)
                                        if (content && content.toLowerCase().includes(query.toLowerCase())) {
                                            addToResults(file, permissionType); 
                                        }
                                    }
                                } catch (innerErr) {
                                    console.log(`[Warning] Failed to verify content for ${cleanPName}`);
                                }
                            }
                        }
                    }
                }
            }
        } catch (cppError) {
            console.log("[Safe Mode] C++ search skipped due to error:", cppError.message);
        } finally {
            // Safe connection close
            if (client) {
                try { client.close(); } catch(e) {}
            }
        }

        // Return results
        return res.status(200).json(results); 

    } catch (criticalError) {
        // Last safety net
        console.error("[CRITICAL] Search controller crashed:", criticalError);
        return res.status(200).json([]); 
    }
};

module.exports = { search };