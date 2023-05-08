const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
    res.render('category_list', {
        title: 'Categories'
    });
});