const Client = require('../client');
const fileModel = require('../models/files'); 
const Permission = require('../models/permissions');

const search = async (req, res) => {
    const query = req.params.query; // Extracting the search string 
    const userId = req.headers['user-id']; // Identify user through header
    if (!query) {     // Validation: Ensure a query was provided
        return res.status(400).json({ error: "Search query is required" });
    }
    const client = new Client() // Initialize the TCP client to communicate with the Exercise 2 server

    try {
        // Send the SEARCH command to the old server 
        const response = await client.sendAndReceive(`search ${query}`); // all files from c++
        // check the status in the first row
        const lines = response.split('\n')
        const statusLine = lines[0].trim() // the firs line- the status
        const statusParts = statusLine.split(' ')
        const statusCode = Number(statusParts[0]) //the number of the status
        const statusMessage = statusParts.slice(1).join(' ')

        if (statusCode !== 200) {
            // if it is not 200- return the problem from the server
            return res.status(statusCode).json({ error: statusMessage })
        }
        // Analyze the response under the assumption it returns fileID separated by whitespace
        const filesId = lines[2].trim().split(' ')
        // Cross reference c++ memory with node.js 
        //al the filesId that returned that exsist+the user got a premission to them + the query is in the content of the file
        const results = []
        for (const idStr of filesId) {
            const id = Number(idStr);
            const file = fileModel.getFileById(id); 
            if (file) {
                const userPermission = Permission.getPermissionForUser(file.id, userId);
                if (userPermission) {
                    if (!idStr.includes(query)) {
                        // if the query is just in the content and not in the Id of the file 
                        results.push(file)
                    }else {//else- check if the query is in the content
                        const fileContent = await client.sendAndReceive(`GET ${file.id}`)
                        const linesForFile = fileContent.split('\n')
                        if (linesForFile[2].includes(query)){ //the query is in the content
                            results.push(file)
                        } 
                    }
                }
             }
        }
        //filter all the files that their names include the query
        const additionalResults = fileModel.getFiles().filter(file => 
        file.name.includes(query) && Permission.getPermissionForUser(file.id, userId))
         //combine the 2 list
        for (const file of additionalResults) {
            if (!results.some(f => f.id === file.id)) {
                results.push(file);
            }
        }

        res.status(200).json(results); // return in JSON
            } 
     
        finally { client.close(); } // Must close connection in the end
};

module.exports = { search };