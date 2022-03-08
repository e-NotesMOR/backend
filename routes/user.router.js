const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

//upload file with name - document
const multer = require('multer')
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/documents')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});
const upload = multer({ storage: fileStorageEngine });

router.route('/:userId')
    .get(userController.getMyRooms)

router.route('/')
    .put(userController.updateRoomDetails);

router.route('/activity')
    .put(userController.updateRoomActivity)
    .delete(userController.deleteRoomFile)

router.route('/message')
    .post(upload.single('document'), userController.addComment)
    .delete(upload.single('document'), userController.deleteComment);


module.exports = router;