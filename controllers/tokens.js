const userModel = require('../models/users'); // import the model
const jwt = require("jsonwebtoken"); // npm install jsonwebtoken
const key = "My super secret key!!!"; 

// Login - POST /api/tokens
const loginUser = (req, res) => {
    const { username, password } = req.body; // Extract the login details sent in the request body    
    const user = userModel.validateUser(username, password); // Check if user exists
    if (user) {
        // Create the data we want to store in the token
        const data = { 
            id: user.id, 
            username: user.username 
        };
        const token = jwt.sign(data, key); // create the token
        // If yes - return it with all its details + token
        res.status(200).json({
            token: token,
            id: user.id,
            username: user.username, 
            image: user.image,
            firstName: user.firstName
            });
    } else {
        // If no - return error
        res.status(401).json({ error: "Invalid username or password" });
    }
};

// Exporting functions so they can be used in other files
module.exports = {
    loginUser
};