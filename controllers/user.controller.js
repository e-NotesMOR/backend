const { Room, Comment } = require('../models');

exports.getMyRooms = async(req, res) => {
    let { userId } = req.params;
    let rooms;
    try {
        rooms = await Room.find({ members: userId }).populate({
            path: 'children',
            populate: {
                path: 'comments',
                populate: { path: 'commenter', model: 'User', select: 'email userName' },
                select: 'comment commenter date'
            }
        }).populate({
            path: 'children',
            populate: {
                path: 'members',
                select: 'email userName'
            }
        }).populate('members', 'userName email').populate({
            path: 'comments',
            populate: { path: 'commenter', model: 'User', select: 'email userName' },
        });
    } catch (err) {
        throw err;
    }
    // GET ALL PARENT ROOMS
    if (rooms.length) {
        rooms = rooms.filter(item => item.childrenOf === null);
        return res.json({ rooms });
    }
    return res.json({ error: 'cannot find user rooms' });
}

exports.updateRoomDetails = async(req, res) => {
    let { roomId, title, description } = req.body;
    let room;

    try {
        room = await Room.updateOne({ _id: roomId }, {
            $set: {
                title,
                description,
            }
        });
    } catch (err) {
        throw err;
    }
    console.log(room);
    if (room.acknowledged === true) return res.json({ room });
    else return res.json({ error: 'cannot update data' });
}

exports.updateRoomActivity = async(req, res) => {
    let { roomId, title, description } = req.body;
    let room;
    var objForUpdate = {};

    if (req.body.title !== '') objForUpdate.title = req.body.title;
    if (req.body.description !== '') objForUpdate.description = req.body.description;
    try {
        room = await Room.updateOne({ _id: roomId }, {
            $set: objForUpdate
        });
    } catch (err) {
        throw err;
    }
    if (room.acknowledged === true) return res.json({ room });
    else return res.json({ error: 'cannot update data' });
}

exports.deleteRoomFile = async(req, res) => {
    let { roomId, filename } = req.body;
    let deleteFile;
    try {
        deleteFile = await Room.updateOne({ _id: roomId }, { $pull: { files: { filename } } });
    } catch (err) {
        throw err;
    }
    if (deleteFile.modifiedCount) return res.json({ deleteFile });
    else return res.json({ error: 'cannot delete file' });
}

//Comments
exports.addComment = async(req, res) => {
    let originalname, filename, path, userComment;
    let { roomId, comment, commenter } = req.body;
    let dpath;
    if (req.file) {
        originalname = req.file.originalname;
        filename = req.file.filename;
        path = req.file.path;
        dpath = path.slice(7, path.length)
    }
    try {
        if (req.file) {
            userComment = await Comment.create({
                comment,
                commenter,
                file: {
                    originalname: originalname.split('.').slice(0, -1).join('.'),
                    filename,
                    path: dpath,
                },
            });
        } else if (comment !== 'null') {
            userComment = await Comment.create({
                comment,
                commenter,
            });
        }
    } catch (err) {
        throw err;
    }

    let toUserRoom;
    if (userComment) {
        try {
            toUserRoom = await Room.updateOne({ _id: roomId }, { $push: { comments: userComment._id } })
        } catch (err) {
            throw err;
        }
    }
    if (userComment && toUserRoom.modifiedCount) return res.json({ userComment, toUserRoom });
    else return res.json({ error: 'cannot push comment' });

}

exports.deleteComment = async(req, res) => {
    let { roomId, commentId } = req.body;
    let updateRoom, deleteComment;
    console.log(roomId,commentId)
    try {
        updateRoom = await Room.updateOne({ _id: roomId }, { $pull: { comments: commentId } });
        deleteComment = await Comment.deleteOne({ _id: commentId });
    } catch (err) {
        throw err;
    }
    if (updateRoom.modifiedCount && deleteComment.deletedCount) return res.json({ updateRoom, deleteComment });
    else return res.json({ error: 'cannot delete file' });
}