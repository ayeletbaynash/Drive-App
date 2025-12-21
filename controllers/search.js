const searchModel = require('../models/search');
const net = require('net'); // For socket communication with the C++ server

const search = (req, res) => {
    const query = req.params.query; // Extracting the search string from the address 
    const localResults = searchModel.searchByName(query); // Get the list of files with names that match the in-memory search   

    // Searching content (calling the C++ server from exercise 2)
    const client = new net.Socket(); // Creating a new communication client
    client.connect(5000, '127.0.0.1', () => {
        client.write(`search ${query}\n`); // Send the search command in the cpp format
    });

    // Listening for the response that will be returned from C++
    client.on('data', (data) => {
        // Converting the response to text and splitting it into an array of file names
        const externalResults = data.toString().split(' '); 
        // Merges the two arrays (local and external) and removes duplicates
        const combinedResults = [...new Set([...localResults, ...externalResults])];
        res.status(200).json(combinedResults); // Return as JSON
        client.destroy(); // Close connection
    });

    // If the C++ server is not working, only the local results are returned
    client.on('error', () => {
        res.status(200).json(localResults);
    });
};

module.exports = { search };