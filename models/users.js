const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating schema for Users
const UserSchema = new Schema({
    // MongoDB creates autumatically id per user
    firstName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    image: { type: String, default: "" }
});

module.exports = mongoose.model('User', UserSchema);
