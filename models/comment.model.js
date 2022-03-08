const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    file: {
        originalname: String,
        filename: String,
        path: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;