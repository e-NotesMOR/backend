const { User } = require('../models');

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

exports.getAllUsers = async(req, res) => {
    let users;
    try {
        users = await getUsers();
    } catch (err) {
        throw err;
    }
    if (users) return res.json({ users });
    return res.json({ error: 'An error occured' });
}

exports.loginUser = async(req, res) => {
    let { email } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        throw err;
    }
    if (user) return res.json({ user });
    return res.json({ error: 'user not found' });
}