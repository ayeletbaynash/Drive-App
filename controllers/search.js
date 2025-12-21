const searchModel = require('../models/search');
const fileModel = require('../models/files'); 
const net = require('net'); // For socket communication with the C++ server

const search = (req, res) => {
    const query = req.params.query; // Extracting the search string from the address 
    const localResults = searchModel.searchByName(query); // Get the list of files with names that match the in-memory search   

    // Searching content (calling the C++ server from exercise 2)
    const client = new net.Socket(); // Creating a new communication client
    client.connect(5000, '127.0.0.1', () => {
        client.write(`search ${query}\n`); // Send the search command in the cpp format
    });

    // Listening for the response from the C++ server
    client.on('data', (data) => {
        // Receive file names from C++ (raw data to string, trimmed and split by spaces)
        const externalNames = data.toString().trim().split(' ');

        // Map the names from C++ to full objects (including IDs) from the local memory
        const externalObjects = externalNames.map(name => {
            // Find the full file object by its name in our local dataset
            return fileModel.getFileByName(name); 
        }).filter(file => file != null); // Remove nulls if a file exists on disk but not in memory

        // Combine local search results with external search results
        const allResults = [...localResults, ...externalObjects];
        // Deduplication - Ensure each file (by ID) appears only once in the final list
        const uniqueResults = allResults.filter((file, index, self) =>
            // Keep only the first occurrence of each file ID in the array
            index === self.findIndex((f) => f.id === file.id)
        );

        res.status(200).json(uniqueResults); // Return as JSON
        client.destroy(); // Close connection

        // If the C++ server is not working, only the local results are returned
        client.on('error', () => {
            res.status(200).json(localResults);
        });
    });
};

module.exports = { search };

///////////// need to add to models/file:
// const getFileByName = (name) => {
//     return all_files.find(f => f.name === name);
// };