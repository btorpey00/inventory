const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

exports.product_list = asyncHandler(async (req, res, next) => {
    res.render('product_list', {
        title: 'Products'
    });
});