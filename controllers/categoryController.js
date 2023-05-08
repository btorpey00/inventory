const Category = require('../models/category');
const Brand = require('../models/brand');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
    res.render('category_form', {
        title: 'Create Category',
        button_text: 'Add Category'
    })
});

exports.category_create_post = [
    body('name', 'Category name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ name: req.body.name });

        if(!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
                button_text: 'Add Category'
            })
            return;
        } else {
            const categoryExists = await Category.findOne({ name: req.body.name }).exec();
            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
        
    })
];

    /// UPDATE CATEGORY GET AND POST ///
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_form', {
        title: 'Update ' + category.name,
        category: category,
        button_text: 'Update Category'
    })
});

exports.category_update_post = [
    body('name', 'Category name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ 
            name: req.body.name,
            _id: req.params.id,
        });

        if(!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
                button_text: 'Update Category'
            })
            return;
        } else {
            const thecategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(thecategory.url);
        }        
    })
];

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