const { User, Room, Comment } = require('../models');
const { faker } = require('@faker-js/faker');

module.exports = async() => {
    let max = 3;
    try {
        await User.deleteMany();
        await Room.deleteMany();
        await Comment.deleteMany();
        console.log('Users Reset');
        for (var i = 0; i < 5; i++) {
            let user1 = await User.create({
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
            let user2 = await User.create({
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
            let user3 = await User.create({
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
            // Comments
            let comment1 = await Comment.create({
                comment: faker.hacker.phrase(),
                commenter: user1._id,
                date: faker.date.soon(),
            });
            let comment2 = await Comment.create({
                comment: faker.hacker.phrase(),
                commenter: user2._id,
                date: faker.date.soon(),
            });
            let comment3 = await Comment.create({
                comment: faker.hacker.phrase(),
                commenter: user3._id,
                date: faker.date.soon(),
                file: {
                    originalname: faker.system.fileName(),
                    filename: "fileId-" + faker.system.fileName(),
                    path: faker.system.filePath(),
                },
            });

            // ROOM CHILDREN
            let childrenId = [];
            for (let i = 0; i < max; i++) {
                let children = await Room.create({
                    title: faker.commerce.product(),
                    description: faker.commerce.productDescription(),
                    files: [{
                        originalname: faker.system.fileName(),
                        filename: "fileId-" + faker.system.fileName(),
                        path: faker.system.filePath(),
                    }, {
                        originalname: faker.system.fileName(),
                        filename: "fileId-" + faker.system.fileName(),
                        path: faker.system.filePath(),
                    }, {
                        originalname: faker.system.fileName(),
                        filename: "fileId-" + faker.system.fileName(),
                        path: faker.system.filePath(),
                    }],
                    code: faker.datatype.uuid(),
                    members: [user1._id, user2._id, user3._id],
                    comments: [comment1._id, comment2._id, comment3._id]
                });
                childrenId.push(children._id);
            }
            // console.log(childrenId);
            //ROOM
            let room1 = await Room.create({
                title: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                files: [{
                    originalname: faker.system.fileName(),
                    filename: "fileId-" + faker.system.fileName(),
                    path: faker.system.filePath(),
                }, {
                    originalname: faker.system.fileName(),
                    filename: "fileId-" + faker.system.fileName(),
                    path: faker.system.filePath(),
                }, {
                    originalname: faker.system.fileName(),
                    filename: "fileId-" + faker.system.fileName(),
                    path: faker.system.filePath(),
                }],
                code: faker.datatype.uuid(),
                members: [user1._id, user2._id, user3._id],
                comments: [comment1._id, comment2._id, comment3._id],
                children: childrenId,
                childrenOf: null
            });

            for (let i = 0; i < max; i++) {
                let updateRoom = await Room.updateOne({ _id: childrenId[i] }, {
                    $set: { childrenOf: room1._id },
                });
                console.log(updateRoom);
            }
            // console.log(user1._id, user2._id, user3._id);
        }
    } catch (err) {
        throw err;
    }
}