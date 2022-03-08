const multer = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/documents')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
            //note: add user id to determine which file
            //file must be unique name
    }
})

const upload = multer({ storage: fileStorageEngine });
module.exports = upload;