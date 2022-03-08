const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    files: [{
        originalname: String,
        filename: String,
        path: String,
    }],
    code: { type: String, default: '' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    childrenOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;