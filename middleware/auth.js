const jwt = require("jsonwebtoken");
const userService = require('../services/users');
const key = "My super secret key!!!"; // same as in login page

const verifyToken = async (req, res, next) => {
    // Look for the token in the request header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ error: 'Token required' });
    }

    // seporate the Bearer from the token
    const token = authHeader.split(" ")[1];

    try {
        // verify the token
        const decoded = jwt.verify(token, key);
        // Checking the user  exists in the system (by the ID in the token)
        const user = await userService.getUserById(decoded.id);
        if (!user) { // if not in db 
            return res.status(401).json({ error: "User no longer exists. Please login again." });
        }
        
        // Adding the user to the request (so that other controllers can use the ID)
        req.userId = decoded.id; 
        req.username = decoded.username;

        next(); // all good
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" }); 
    }
};

module.exports = verifyToken;