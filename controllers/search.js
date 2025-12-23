const client = require('../client');
const fileModel = require('../models/files'); 
const Permission = require('../models/permissions');

const search = async (req, res) => {
    const query = req.params.query; // Extracting the search string 
    const userId = req.headers['user-id']; // Identify user through header
    if (!query) {     // Validation: Ensure a query was provided
        return res.status(400).json({ error: "Search query is required" });
    }
    const Client = new client('127.0.0.1', 5000); // Initialize the TCP client to communicate with the Exercise 2 server

    try {
        // Send the SEARCH command to the old server 
        const response = await Client.sendAndReceive(`search ${query}`); // all files from c++
        // Analyze the response under the assumption it returns physical file names separated by whitespace
        const physicalNames = response.trim().split(/\s+/);
        // Cross reference c++ memory with node.js 
        const allMetadata = fileModel.getFiles(); // all files from node.js
        const results = allMetadata.filter(file => { // return only full file details
            const hasPhysicalMatch = physicalNames.includes(file.physical_name);
            const userPermission = Permission.getPermissionForUser(file.id, userId); // Checking premissions
            return hasPhysicalMatch && userPermission; // return only full file details that have premission
        });
        res.status(200).json(results); // return in JSON
            } 
        catch (error) { // If fails connection
            console.error("Search error:", error);
            res.status(500).json({ error: "Failed to communicate with storage server" });
            } 
        finally { Client.close(); } // Must close connection in the end
};

module.exports = { search };