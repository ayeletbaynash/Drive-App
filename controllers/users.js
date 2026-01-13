const userModel = require('../models/users'); // import the model

// Registration - POST /api/users
const registerUser = (req, res) => {
    // Extract the data sent in the request body
    const { firstName, username, password, emailAddress, image } = req.body;

    // If one of them is wrong or missing return error
    if (!username || !password || !emailAddress || !image || !firstName) { 
        return res.status(400).json({ error: "All fields are required" });
    }

    // Cant have 2 users with the same name
    if (userModel.getUserByUsername(username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    // Cant use same email twice
    if (userModel.getUserByEmail(emailAddress)) {
    return res.status(400).json({ error: "Email already registered" });
    }

    // No spaces allowed in username
    if (username.includes(' ')) {
        return res.status(400).json({ error: "Username cannot contain spaces" });
    }

    // At least 8 char for password
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Password containing upper lower and number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            error: "Password must include at least one uppercase letter, one lowercase letter, and one number" 
        });
    }

    // Email must be "__@__.__"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
        return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Calling a function in the Model to register the user in the system and receive the created object.
    const newUser = userModel.createUser(firstName, username, password, emailAddress, image);
    // Return the users id
    res.status(201).json({ id: newUser.id });
};

// Recieaving users information - GET /api/users/:id
const getUserProfile = (req, res) => {
    // Returns details by id
    const user = userModel.getUserById(req.params.id);

    if (user) {
        // If user exists return all details
        res.status(200).json({
            firstName: user.firstName,
            username: user.username,
            emailAddress: user.emailAddress,
            image: user.image,
            password: user.password
        });
    } else { // If not- return error
        res.status(404).json({ error: "User not found" });
    }
};

// Exporting functions so they can be used in other files
module.exports = {
    registerUser,
    getUserProfile
};