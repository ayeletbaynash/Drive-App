const userService = require('../services/users'); // Import the service instead of the model
const jwt = require("jsonwebtoken"); // npm install jsonwebtoken
const key = "My super secret key!!!"; 

// Login - POST /api/tokens
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // Extract the login details sent in the request body    
        const user = await userService.validateUser(username, password); // Check if user exists
        if (user) {
            // Create the data we want to store in the token
            const data = { 
                id: user._id, 
                username: user.username 
            };
            const token = jwt.sign(data, key); // create the token
            // If yes - return it with all its details + token
            res.status(200).json({
                token: token,
                id: user._id,
                username: user.username, 
                image: user.image,
                firstName: user.firstName
            });
        } else {
            // If no - return error
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        // Handle server errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Exporting functions so they can be used in other files
module.exports = {
    loginUser
};