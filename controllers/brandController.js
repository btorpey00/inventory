const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');

exports.brand_list = asyncHandler(async (req, res, next) => {
    res.render('brand_list', {
        title: 'Brands'
    });
});