const Client = require('../client');
const fileModel = require('../models/files'); 
const Permission = require('../models/permissions');

const search = async (req, res) => {
    // Critical Protections (to prevent 500 crashes)
    try {
        const query = req.params.query; 
        const userId = req.userId;
        
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        // Final results array
        const results = [];
        // Fetch all files from memory
        const allFiles = fileModel.getFiles(); 
        // Helper set to prevent duplicates
        const processedFileIds = new Set();

        const nameMatches = allFiles.filter(file => {
            try {
                // Protection in case permissions are missing or object is incomplete
                const hasPermission = Permission.getPermissionForUser(file.id, userId);
                if (!hasPermission) return false;
                //if (isFileOrParentDeleted(file, allFiles)) return false;

                // Case Insensitive search
                return file.name && file.name.toLowerCase().includes(query.toLowerCase());
            } catch (e) {
                return false; 
            }
        });

        // Add found items to results
        nameMatches.forEach(file => {
            results.push(file);
            processedFileIds.add(file.id);
        });

        // Attempt to contact C++ 
        let client = null;
        try {
            client = new Client(); 
            // Try to talk to C++. If it throws an error - we catch it below
            const response = await client.sendAndReceive(`search ${query}`); 
            
            if (response) {
                const lines = response.split('\n');
                // Check that lines exist before accessing them
                const statusLine = lines[0] ? lines[0].trim() : "";
                const statusCode = Number(statusLine.split(' ')[0]);

                if (statusCode === 200) {
                    const resultLine = lines[2] ? lines[2].trim() : "";
                    const physicalNames = resultLine ? resultLine.split(' ') : [];
                    
                    for (const pName of physicalNames) {
                        const cleanPName = pName.trim();
                        if (!cleanPName) continue;

                        // Convert from physical name to logical name
                        const file = allFiles.find(f => f.physicalName === cleanPName);
                        
                        // If we found a file and haven't added it yet
                        if (file && !processedFileIds.has(file.id)) {
                            const userPermission = Permission.getPermissionForUser(file.id, userId);
                            if (userPermission) {
                                try {
                                    const contentResponse = await client.sendAndReceive(`GET ${cleanPName}`);
                                    const contentLines = contentResponse.split('\n');
                                    // Assuming content starts from line 3 (index 2) onwards
                                    // We join the rest just in case content has newlines
                                    const encodedContent = contentLines.slice(2).join('\n');
                                    const content = Buffer.from(encodedContent, 'base64').toString('utf-8');
                                    // Check if query is truly in the content (Case Insensitive)
                                    if (content && content.toLowerCase().includes(query.toLowerCase())) {
                                        results.push(file);
                                        processedFileIds.add(file.id);
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
        // Last safety net - if everything explodes, return empty array instead of error
        console.error("[CRITICAL] Search controller crashed:", criticalError);
        return res.status(200).json([]); 
    }
};

module.exports = { search };