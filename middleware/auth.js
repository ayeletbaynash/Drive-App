const jwt = require("jsonwebtoken");
const key = "My super secret key!!!"; // same as in login page

const verifyToken = (req, res, next) => {
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
        
        // Adding the user to the request (so that other controllers can use the ID)
        req.userId = decoded.id; 
        req.username = decoded.username;

        next(); // all good
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" }); // not
    }
};

module.exports = verifyToken;