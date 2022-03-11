const express = require('express');
const router = express.Router();
const { searchController } = require('../controllers');

router.route('/')
    .post(searchController.searchLibrary)

module.exports = router;