const userModel = require('../models/users'); // import the model

// 1. Registration - POST /api/users
const registerUser = (req, res) => {
    // Extract the data sent in the request body
    const { username, password, emailAddress, image } = req.body;

    // If one of them is wrong or missing return error
    if (!username || !password || !emailAddress || !image) { 
        return res.status(400).json({ error: "All fields are required" });
    }

    // Cant have 2 users with the same name
    if (userModel.getUserByUsername(username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    // No spaces allowed in username
    if (username.includes(' ')) {
        return res.status(400).json({ error: "Username cannot contain spaces" });
    }

    // Calling a function in the Model to register the user in the system and receive the created object.
    const newUser = userModel.createUser(username, password, emailAddress, image);
    // Return the users id
    res.status(201).json({ id: newUser.id });
};

// 2. Login - POST /api/tokens
const loginUser = (req, res) => {
    // Extract the login details sent in the request body    
    const { username, password } = req.body;
    // Check if user exists
    const user = userModel.validateUser(username, password);
    if (user) {
        // If yes - return it
        res.status(200).json({ id: user.id });
    } else {
        // If no - return error
        res.status(401).json({ error: "Invalid username or password" });
    }
};

// 3. Recieaving users information - GET /api/users/:id
const getUserProfile = (req, res) => {
    // Returns details by id
    const user = userModel.getUserById(req.params.id);

    if (user) {
        // If user exists return all details
        res.status(200).json({
            username: user.username,
            emailAddress: user.emailAddress,
            image: user.image
        });
    } else { // If not- return error
        res.status(404).json({ error: "User not found" });
    }
};

// Exporting functions so they can be used in other files
module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};