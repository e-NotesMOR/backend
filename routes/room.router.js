const express = require('express');
const router = express.Router();
const { roomController } = require('../controllers');

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

router.route('/')
    .get(roomController.getRoomDetails)
    .post(upload.single('document'), roomController.addNewRoom)
    .put(roomController.joinRoom)
    .delete(roomController.deletePrivateRoom);

router.route('/import')
    .post(upload.single('document'), roomController.addNewFile);

router.route('/leave')
    .post(roomController.leaveRoom)



module.exports = router;