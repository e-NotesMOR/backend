const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Accepts "authorization: Bearer eyy..."
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.payload = payload;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};