const Product = require('../models/product');
const Category = require('../models/category');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, variants, price, discount, stock } = req.body;
    let totalStock = 0;
    if (variants && Array.isArray(variants)) {
      totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else if (stock !== undefined) {
      totalStock = Number(stock);
    }
    const product = new Product({
      name,
      description,
      category,
      variants,
      price,
      discount,
      totalStock,
      inStock: totalStock > 0
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { 
      name, 
      category, 
      minPrice, 
      maxPrice, 
      minStock, 
      maxStock, 
      inStock,
      minDiscount, 
      maxDiscount, 
      hasDiscount,
      createdAfter, 
      createdBefore,
      sortBy,
      sortOrder 
    } = req.query;
    
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({ 
          name: { $regex: new RegExp('^' + category + '$', 'i') }
        });
        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          return res.status(404).json({ error: `Category '${category}' not found` });
        }
      }
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minStock || maxStock) {
      filter.totalStock = {};
      if (minStock) filter.totalStock.$gte = Number(minStock);
      if (maxStock) filter.totalStock.$lte = Number(maxStock);
    }
    if (inStock !== undefined) {
      if (inStock === 'true') {
        filter.totalStock = { ...filter.totalStock, $gt: 0 };
      } else if (inStock === 'false') {
        filter.totalStock = { ...filter.totalStock, $eq: 0 };
      }
    }
    if (minDiscount || maxDiscount) {
      filter.discount = {};
      if (minDiscount) filter.discount.$gte = Number(minDiscount);
      if (maxDiscount) filter.discount.$lte = Number(maxDiscount);
    }
    if (hasDiscount !== undefined) {
      if (hasDiscount === 'true') {
        filter.discount = { ...filter.discount, $gt: 0 };
      } else if (hasDiscount === 'false') {
        filter.discount = { ...filter.discount, $eq: 0 };
      }
    }
    if (createdAfter || createdBefore) {
      filter.createdAt = {};
      if (createdAfter) filter.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) filter.createdAt.$lte = new Date(createdBefore);
    }
    let sort = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort[sortBy] = order;
    } else {
      sort = { createdAt: -1 };
    }
    const products = await Product.find(filter).populate('category').sort(sort);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, variants, price, discount, stock } = req.body;
    let totalStock = 0;
    if (variants && Array.isArray(variants)) {
      totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else if (stock !== undefined) {
      totalStock = Number(stock);
    } else {
      const existingProduct = await Product.findById(req.params.id);
      if (existingProduct) {
        totalStock = existingProduct.totalStock;
      }
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, variants, price, discount, totalStock, inStock: totalStock > 0 },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find({ totalStock: { $lte: threshold } });
    res.json(products);
  } catch (err) {
    next(err);
  }
};