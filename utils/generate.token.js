const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (user) => {
    const { JWT_SECRET } = process.env;
    let token;
    token = jwt.sign(user._doc, JWT_SECRET);
    return `Bearer ${token}`;
};