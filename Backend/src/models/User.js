const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already exists" ],
        required: true,
    },

    email: {
        type: String,
        unique: [ true, "email already exists" ],
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    resetPasswordToken: {
        type: String,
        default: null,
    },

    resetPasswordExpires: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;