var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController')

router.get('/', category_controller.category_list);

module.exports = router;