const User = require('../models/users');

// Create a new user in the database
const createUser = async (firstName, username, password, emailAddress, image) => {
    const newUser = new User({ firstName, username, password, emailAddress, image });
    return await newUser.save(); 
};

// Find a user by username and password for login
const validateUser = async (username, password) => {
    return await User.findOne({ username, password });
};

// Retrieve a user by their unique MongoDB ID
const getUserById = async (id) => {
    return await User.findById(id); 
};

// Retrieve a user by their username
const getUserByUsername = async (username) => {
    return await User.findOne({ username });
};

// User retrieval function by email
const getUserByEmail = async (emailAddress) => {
    return await User.findOne({ emailAddress });
};

module.exports = {
    createUser,
    validateUser,
    getUserById,
    getUserByUsername,
    getUserByEmail
};