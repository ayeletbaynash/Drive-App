let uIdCounter = 0; // Start counter for user id index
const all_users = []; // Keep all users here (in-memory)

// Create new user (Registration)
const createUser = (username, password, emailAddress, image) => {
    const newUser = { 
        id: (uIdCounter++).toString(), // Unique identifier
        username, 
        password, 
        emailAddress, 
        image 
    };
    all_users.push(newUser); // to memory
    return newUser; // in JASON
};

// Authentication function (login) - give username and password returns all detailes or undefined if not exist
const validateUser = (username, password) => {
    return all_users.find(u => u.username === username && u.password === password);
};

// User retrieval function by ID
const getUserById = (id) => {
    return all_users.find(u => u.id == id);
};

// User retrieval function by username
const getUserByUsername = (username) => {
    return all_users.find(u => u.username === username);
};

// User retrieval function by email
const getUserByEmail = (email) => {
    return all_users.find(u => u.emailAddress === email);
};

// Exporting functions so they can be used in other files
module.exports = {
    createUser,
    validateUser,
    getUserById,
    getUserByUsername,
    getUserByEmail
};