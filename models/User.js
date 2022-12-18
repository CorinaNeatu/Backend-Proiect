const mongoose = require('mongoose');

//code first
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
}, { timestamps: true})

//timestamps will automatically created the properties createdAt and updatedAt

module.exports = mongoose.model("User", UserSchema)