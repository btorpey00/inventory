const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

exports.brand_list = asyncHandler(async (req, res, next) => {
    const allBrands = await Brand.find().sort({ name: 1 }).exec();

    res.render('brand_list', {
        title: 'Brands',
        brand_list: allBrands
    });
});

exports.brand_detail = asyncHandler(async (req, res, next) => {
    const [brand, productsInBrand, allCategories] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, 'name category').populate('category').exec(),
        Category.find({}, 'name').sort({ name: 1 }).exec(),
    ]);

    if (brand === null) {
        const err = new Error('Brand not found');
        err.status = 404;
        return next(err);
    }

    res.render('brand_detail', {
        title: 'Brand Detail',
        brand: brand,
        brand_products: productsInBrand,
        all_categories: allCategories,
    });
});

/// CREATE BRAND GET AND POST ///
exports.brand_create_get = asyncHandler(async (req, res, next) => {

});

exports.brand_create_post = asyncHandler(async (req, res, next) => {

});

    /// UPDATE BRAND GET AND POST ///
exports.brand_update_get = asyncHandler(async (req, res, next) => {

});

exports.brand_update_post = asyncHandler(async (req, res, next) => {

});

    /// DELETE BRAND GET AND POST ///
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
    const [brand, allProductsInBrand] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, 'name category').populate('category').exec()
    ]);

    if (brand === null) {
        res.redirect('/brands')
    }

    res.render('brand_delete', {
        title: 'Delete ' + brand.name,
        brand: brand,
        brand_products: allProductsInBrand
    });
});

exports.brand_delete_post = asyncHandler(async (req, res, next) => {
    const [brand, allProductsInBrand] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Product.find({ brand: req.params.id }, 'name category').populate('category').exec()
    ]);

    if (allProductsInBrand.length > 0) {
        res.render('brand_delete', {
            title: 'Delete ' + brand.name,
            brand: brand,
            brand_products: allProductsInBrand
        });
        return;
    } else {
        await Brand.findByIdAndRemove(req.body.brandid);
        res.redirect('/brands');
    }
});