const fileModel = require('./models/files'); 

const searchByName = (query) => {
    const allFiles = fileModel.getAllFiles(); // Returns all files in memory
    return allFiles.filter(file => file.name.includes(query)); // Return all files from memory that include the query
};

module.exports = { 
    searchByName 
};