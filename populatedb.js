#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Brand = require("./models/brand");
  const Category = require("./models/category");
  const Product = require("./models/product");

  
  const brands = [];
  const categories = [];
  const products = [];
 
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createBrands();
    await createCategories();
    await createProducts();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function brandCreate(name) {
    const brand = new Brand({ name: name });
    await brand.save();
    brands.push(brand);
    console.log(`Added brand: ${name}`);
  }
  
  async function categoryCreate(name) {
    const category = new Category({ name: name });
  
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
  }
  
  async function productCreate(name, description, quantity, brand, category) {
    productdetail = {
      name: name,
      description: description,
      quantity: quantity,
      brand: brand,
      category: category
    };
  
    const product = new Product(productdetail);
    await product.save();
    products.push(product);
    console.log(`Added product: ${name}`);
  }
  
  async function createBrands() {
    console.log("Adding brands");
    await Promise.all([
      brandCreate("Nike"),
      brandCreate("Adidas"),
      brandCreate("Under Armour"),
    ]);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate('Tops'),
      categoryCreate('Bottoms'),
      categoryCreate('Shoes'),
      categoryCreate('Accessories'),
    ]);
  }
  
  async function createProducts() {
    console.log("Adding Products");
    await Promise.all([
      productCreate(
        'Red Shirt',
        'Wonderful red shirt that will keep you looking and feeling cool',
        "25",
        brands[0],
        categories[0]
      ),
      productCreate(
        'Blue Shirt',
        'Wonderful blue shirt that will keep you looking and feeling cool',
        "10",
        brands[1],
        categories[0]
      ),
      productCreate(
        'Orange Shirt',
        'Wonderful orange shirt that will keep you looking and feeling cool',
        "8",
        brands[3],
        categories[0]
      ),

      productCreate(
        'Blue Pants',
        'Wonderful blue pants that will keep you looking and feeling cool',
        "6",
        brands[0],
        categories[1]
      ),
      productCreate(
        'Red Pants',
        'Wonderful red pants that will keep you looking and feeling cool',
        "8",
        brands[1],
        categories[1]
      ),
      productCreate(
        'Yellow Pants',
        'Wonderful yellow pants that will keep you looking and feeling cool',
        "44",
        brands[2],
        categories[1]
      ),

      productCreate(
        'Air Jordans',
        'Be like Mike in these shoes',
        "9",
        brands[0],
        categories[2]
      ),
      productCreate(
        'Dame 8',
        "It's Dame Time!!!",
        "4",
        brands[1],
        categories[2]
      ),
      productCreate(
        'Curry Flow',
        'Shoot from the logo with ease',
        "15",
        brands[2],
        categories[2]
      ),

      productCreate(
        'Green Hat',
        'Keep your head covered and the sun out of your eyes',
        "4",
        brands[0],
        categories[3]
      ),
      productCreate(
        'Belt',
        "Don't let your pants fall off!",
        "6",
        brands[1],
        categories[3]
      ),
      productCreate(
        'Water Bottle',
        'Make sure you are staying hydrated',
        "42",
        brands[2],
        categories[3]
      ),
      
    ]);
  }
