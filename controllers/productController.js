const Product = require('../models/product');
const asyncHandler = require('express-async-handler');


    /// ALL PRODUCTS LIST ///
exports.product_list = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find().populate('brand').exec();

    res.render('product_list', {
        title: 'Products',
        product_list: allProducts
    });
});

    /// PRODUCT DETAILS ///
exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('brand category').exec();

    if (product === null) {
        const err = new Error('Product not found');
        err.status = 404;
        return next(err);
    }

    res.render('product_detail', {
        title: product.name + ' Details',
        product: product,
    })
});


    /// CREATE PRODUCT GET AND POST ///
exports.product_create_get = asyncHandler(async (req, res, next) => {

});

exports.product_create_post = asyncHandler(async (req, res, next) => {

});

    /// UPDATE PRODUCT GET AND POST ///
exports.product_update_get = asyncHandler(async (req, res, next) => {

});

exports.product_update_post = asyncHandler(async (req, res, next) => {

});

    /// DELETE PRODUCT GET AND POST ///
exports.product_delete_get = asyncHandler(async (req, res, next) => {

});

exports.product_delete_post = asyncHandler(async (req, res, next) => {

});