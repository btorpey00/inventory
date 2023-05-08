var express = require('express');
var router = express.Router();

const brand_controller = require('../controllers/brandController')


router.get('/', brand_controller.brand_list)

module.exports = router;