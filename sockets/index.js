const { User, Message, Profile } = require('../models');
const { generateToken } = require('../utils');
const mongoose = require('mongoose');

module.exports = (client) => {
    client.on('connection', async function(socket) {
        socket.on('message', (payload) => {
            client.to("hehe").emit('message', { id: socket.id, message: payload });
        });

        socket.on('join', (payload) => {
            socket.join("hehe");
            console.log("User joined hehe");
            client.emit('join', payload);
        })
    });
};