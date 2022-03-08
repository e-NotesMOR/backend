module.exports = (app) => {
    app.use('/api/logins', require('./login.router'));
    app.use('/api/registers', require('./register.router'));
    app.use('/api/rooms', require('./room.router'));
    app.use('/api/profiles', require('./user.router'));
};