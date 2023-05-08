const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
    res.render('brand_form', {
        title: 'Create Brand',
        button_text: 'Add Brand'
    })
});

exports.brand_create_post = [
    body('name', 'Brand name is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const brand = new Brand({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Create Brand',
                brand: brand,
                errors: errors.array(),
                button_text: 'Add Brand'
            })
            return;
        } else {
            const brandExists = await Brand.findOne({ name: req.body.name }).exec();
            if (brandExists) {
                res.redirect(brandExists.url);
            } else {
                await brand.save();
                res.redirect(brand.url);
            }
        }
    }),
]
    

    /// UPDATE BRAND GET AND POST ///
exports.brand_update_get = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id).exec();

    if (brand === null) {
        const err = new Error('Brand not found');
        err.status = 404;
        return next(err);
    }

    res.render('brand_form', {
        title: 'Update ' + brand.name,
        brand: brand,
        button_text: 'Update'
    })
});

exports.brand_update_post = [
    body('name', 'Brand name is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const brand = new Brand({ 
            name: req.body.name,
            _id: req.params.id,
         });

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Update ' + brand.name,
                brand: brand,
                errors: errors.array(),
                button_text: 'Update',
            })
            return;
        } else {
            const thebrand = await Brand.findByIdAndUpdate(req.params.id, brand, {});
            res.redirect(thebrand.url);
        }
    }),
]

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