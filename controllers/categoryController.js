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
    const [category, allProductsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, 'name brand').populate('brand').exec()
    ]);

    if (category === null) {
        res.redirect('/categories')
    }

    res.render('category_delete', {
        title: 'Delete ' + category.name,
        category: category,
        category_products: allProductsInCategory
    });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allProductsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, 'name brand').populate('brand').exec()
    ]);

    if (allProductsInCategory.length > 0) {
        res.render('category_delete', {
            title: 'Delete ' + category.name,
            category: category,
            category_products: allProductsInCategory
        });
        return;
    } else {
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect('/categories');
    }
});