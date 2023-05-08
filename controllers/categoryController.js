const Category = require('../models/category');
const Brand = require('../models/brand');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec();
    
    res.render('category_list', {
        title: 'Categories',
        category_list: allCategories
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, productsInCategory, allBrands] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, 'name brand').populate('brand category').exec(),
        Brand.find({}, 'name').exec(),
    ]);

    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_detail', {
        title: 'Category Detail',
        category: category,
        category_products: productsInCategory,
        all_brands: allBrands,
    });
});

/// CREATE CATEGORY GET AND POST ///
exports.category_create_get = asyncHandler(async (req, res, next) => {

});

exports.category_create_post = asyncHandler(async (req, res, next) => {

});

    /// UPDATE CATEGORY GET AND POST ///
exports.category_update_get = asyncHandler(async (req, res, next) => {

});

exports.category_update_post = asyncHandler(async (req, res, next) => {

});

    /// DELETE CATEGORY GET AND POST ///
exports.category_delete_get = asyncHandler(async (req, res, next) => {

});

exports.category_delete_post = asyncHandler(async (req, res, next) => {

});