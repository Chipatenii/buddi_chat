const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    realName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }, // Path to the uploaded file
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;