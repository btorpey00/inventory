var express = require('express');
var router = express.Router();

const product_controller = require('../controllers/productController')

router.get('/', product_controller.product_list);

module.exports = router;