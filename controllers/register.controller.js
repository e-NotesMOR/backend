const { User } = require('../models');
const { generateToken } = require('../utils');

const getUsers = async() => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        throw err;
    }
    if (users) return users;
    return 'error';
}

exports.registerUser = async(req, res) => {
    let { email, password, userName } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        throw err;
    }
    // existing user
    if (user) {
        const access_token = generateToken(user);
        return res.json({ access_token, userName: user.userName });
    } else {
        let newUser;
        try {
            newUser = await User.create({
                email,
                password,
                userName
            });
        } catch (err) {
            throw err;
        }

        const access_token = generateToken(newUser);
        return res.json({ access_token, userName });
    }
}