const { Room } = require('../models');
const { faker } = require('@faker-js/faker');

exports.getRoomDetails = async(req, res) => {
    let rooms;
    try {
        rooms = await Room.find({}).populate({
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

    // GET ALL ROOMS WITH CHILDREN
    // rooms = rooms.filter(item => item.childrenOf === null);
    if (rooms.length) return res.json({ rooms });
    return res.json({ error: 'server error' });
}
exports.addNewFile = async(req, res) => {
    let { roomId } = req.body;
    let imported;
    if (req.file) {
        let { originalname, filename, path } = req.file;
        let dpath = path.slice(7, path.length)
        try {
            imported = await Room.updateOne({ _id: roomId }, { $push: { files: { originalname, filename, path: dpath } } });
        } catch (err) {
            throw err;
        }
    }
    if (imported.modifiedCount) return res.json({ room: imported })
    else res.json({ error: 'file not found!' });
}

exports.addNewRoom = async(req, res) => {
    let { title, description, userId, childrenOf } = req.body;
    if (childrenOf == 'Personal') {
        childrenOf = null;
    }
    let originalname, filename, path;
    if (req.file) {
        originalname = req.file.originalname;
        filename = req.file.filename;
        path = req.file.path;
    }
    let room;
    let updateParent;
    try {
        if (req.file) {
            room = await Room.create({
                title,
                description,
                code: faker.datatype.uuid(),
                members: [userId],
                files: {
                    originalname: originalname.split('.').slice(0, -1).join('.'),
                    filename,
                    path
                },
                childrenOf
            });
        } else {
            room = await Room.create({
                title,
                description,
                members: [userId],
                code: faker.datatype.uuid(),
                childrenOf,
            });

            if (childrenOf !== null) {
                updateParent = await Room.updateOne({ _id: childrenOf }, { //UPDATE PARENT MEMBERS
                    $addToSet: { children: room._id }
                })
                console.log(updateParent)
            }
        }

    } catch (err) {
        throw err;
    }
    if (room) return res.json({ room });
    else return res.json({ error: 'server error' });
}


//Join Room Invitation Code
exports.joinRoom = async(req, res) => {
    let room, childIds = [];
    let { code, userId } = req.body;
    let codeRoom;
    try {
        room = await Room.findOne({ code });
        if(room){
             if (room.childrenOf === null) { // Parent room
                codeRoom = await Room.updateOne({ code }, { //UPDATE PARENT MEMBERS
                    $addToSet: { members: userId }
                });

                childIds = JSON.parse(JSON.stringify(room.children));
                childIds.map(async(childId) => {
                    await Room.updateOne({ _id: childId }, { //UPDATE CHILDROOM MEMBERS
                        $addToSet: { members: userId }
                    })
                });
            } else { //Room is a child
                codeRoom = await Room.updateOne({ code }, { //UPDATE CHILD MEMBERS
                    $addToSet: { members: userId }
                });
                await Room.updateOne({ _id: room.childrenOf }, { //UPDATE PARENT MEMBERS
                    $addToSet: { members: userId }
                })
            }
        }
    } catch (err) {
        throw err;
    }
    if(codeRoom === undefined) return res.json({ error: 'cannot join room' });
    else if (codeRoom.modifiedCount) return res.json({ room });
    else return res.json({ error: 'cannot join room' });
}

exports.deletePrivateRoom = async(req, res) => {
    let room, many;
    let { roomId } = req.body;
    try {
        room = await Room.deleteOne({ _id: roomId });
        many = await Room.deleteMany({ childrenOf: roomId });
    } catch (err) {
        throw err;
    }
    if (room.deletedCount) return res.json({ room });
    else return res.json({ error: 'cannot delete room' });
}

exports.leaveRoom = async(req, res) => {
    let room;
    let { roomId,userId} = req.body;
    try {
        room = await Room.updateOne({ _id: roomId }, { $pull: { members: userId  } });
    } catch (err) {
        throw err;
    }
    if (room.modifiedCount) return res.json({ room });
    else return res.json({ error: 'cannot delete room' });
}