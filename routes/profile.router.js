const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: './public/apps/uploads/' });
const { jwtAuth, sameUser } = require('../middlewares');
const { profileController } = require('../controllers');

router.route('/users').get(profileController.getUsers);

router.use(jwtAuth);
router
  .route('/:userId')
  .get(profileController.get)
  .get(profileController.getOne)
  .post([sameUser, upload.single('file')], profileController.post)
  .put(profileController.put);

router.route('/').post(profileController.getUserInfo);

module.exports = router;
