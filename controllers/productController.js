const Product = require('../models/product');
const Brand = require('../models/brand');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
    const [allBrands, allCategories] = await Promise.all([
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().exec(),
    ]);

    res.render('product_form', {
        title: 'Create Product',
        button_text: 'Add Product',
        all_brands: allBrands,
        all_categories: allCategories,
    })
});

exports.product_create_post = [
    body('name', 'Product name is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'Please enter a product descrition')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('quantity', 'Quantity is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('brand', 'Please select a brand')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'Please select a category')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            brand: req.body.brand,
            category: req.body.category,
        });

        if (!errors.isEmpty()) {
            const [allBrands, allCategories] = await Promise.all([
                Brand.find().sort({ name: 1 }).exec(),
                Category.find().exec(),
            ]);
        
            res.render('product_form', {
                title: 'Create Product',
                button_text: 'Add Product',
                product: product,
                all_brands: allBrands,
                all_categories: allCategories,
                errors: errors.array(),
            })
        } else {
            await product.save();
            res.redirect(product.url);
        }
    })
]

    /// UPDATE PRODUCT GET AND POST ///
exports.product_update_get = asyncHandler(async (req, res, next) => {
    const [product, allBrands, allCategories] = await Promise.all([
        Product.findById(req.params.id).populate('brand category').exec(),
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().exec(),
    ]);

    if (product === null) {
        const err = new Error('Product not found')
        err.status = 404;
        return next(err);
    }

    res.render('product_form', {
        title: 'Update ' + product.name,
        product: product,
        all_brands: allBrands,
        all_categories: allCategories,
        button_text: 'Update Product',
    })
});

exports.product_update_post = [
    body('name', 'Product name is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('description', 'Please enter a product descrition')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('quantity', 'Quantity is required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('brand', 'Please select a brand')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'Please select a category')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            brand: req.body.brand,
            category: req.body.category,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const [allBrands, allCategories] = await Promise.all([
                Brand.find().sort({ name: 1 }).exec(),
                Category.find().exec(),
            ]);
        
            res.render('product_form', {
                title: 'Update' + product.name,
                button_text: 'Updage',
                product: product,
                all_brands: allBrands,
                all_categories: allCategories,
                errors: errors.array(),
            })
        } else {
            const theproduct = await Product.findByIdAndUpdate(req.params.id, product, {});
            res.redirect(theproduct.url);
        }
    })
]

    /// DELETE PRODUCT GET AND POST ///
exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('brand').exec();

    if (product === null) {
        res.redirect('/products')
    }

    res.render('product_delete', {
        title: 'Delete ' + product.name,
        product: product,
    })
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
    await Product.findByIdAndRemove(req.body.productid);
    res.redirect('/products');
});