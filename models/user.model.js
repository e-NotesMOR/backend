const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;