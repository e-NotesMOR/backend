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

exports.addNewRoom = async(req, res) => {
    let { title, description, userId, childrenOf } = req.body;
    let originalname, filename, path;
    if (req.file) {
        originalname = req.file.originalname;
        filename = req.file.filename;
        path = req.file.path;
    }
    let room;
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
        }

    } catch (err) {
        throw err;
    }
    if (room) return res.json({ room });
    else return res.json({ error: 'server error' });
}

exports.importNewRoom = async(req, res) => {
    let imported;
    if (req.file) {
        let { originalname, filename, path } = req.file;
        try {
            imported = await Room.create({
                title: originalname.split('.').slice(0, -1).join('.'),
                code: faker.datatype.uuid(),
                files: {
                    originalname,
                    filename,
                    path
                },
            });
        } catch (err) {
            throw err;
        }
        return res.json({ room: imported })
    } else res.json({ error: 'file not found!' });
}

//Join Room Invitation Code
exports.joinRoom = async(req, res) => {
    let room, childIds = [];
    let { code, userId } = req.body;
    let codeRoom;
    try {
        room = await Room.findOne({ code });
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
    } catch (err) {
        throw err;
    }

    if (codeRoom.modifiedCount) return res.json({ room });
    else return res.json({ error: 'cannot join room' });
}

exports.deletePrivateRoom = async(req, res) => {
    let room;
    let { roomId } = req.body;
    try {
        room = await Room.deleteOne({ _id: roomId, $where: 'this.members.length<2' });
    } catch (err) {
        throw err;
    }
    if (room.deletedCount) return res.json({ room });
    else return res.json({ error: 'cannot delete room' });
}