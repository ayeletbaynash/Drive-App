const userModel = require('../models/users'); // import the model

// Login - POST /api/tokens
const loginUser = (req, res) => {
    // Extract the login details sent in the request body    
    const { username, password } = req.body;
    // Check if user exists
    const user = userModel.validateUser(username, password);
    if (user) {
        // If yes - return it with all its details
        res.status(200).json({
            id: user.id,
            username: user.username, 
            image: user.image
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