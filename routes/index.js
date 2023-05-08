var express = require('express');
var router = express.Router();

const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler(async (req, res, next) => {
  const [numBrands, numProducts, numCategories] = await Promise.all([
    Brand.countDocuments().exec(),
    Product.countDocuments().exec(),
    Category.countDocuments().exec(),
  ])

  res.render('index', { 
    title: 'Inventory',
    num_brands: numBrands,
    num_products: numProducts,
    num_categories: numCategories,
  });
}));


module.exports = router;
