const Product = require('../models/Product');

const getProducts = async (req, res) => {

  try {

    const { search, category } = req.query;

    const filter = {
      user: req.user._id,
    };

    // Search functionality
    if (search) {

      filter.$or = [

        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },

        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },

        {
          tags: {
            $in: [new RegExp(search, 'i')],
          },
        },

      ];

    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   POST /api/products
// @desc    Create product
// @access  Private
const createProduct = async (req, res) => {

  try {

    const {
      name,
      category,
      price,
      stock,
      description,
      tags,
      imageUrl,
    } = req.body;

    // Validation
    if (!name || price === undefined) {

      return res.status(400).json({
        message: 'Name and price are required',
      });

    }

    const product = await Product.create({

      user: req.user._id,

      name,

      category: category || 'Other',

      price: parseFloat(price),

      stock: parseInt(stock) || 0,

      description: description || '',

      imageUrl: imageUrl || '',

      tags: Array.isArray(tags)
        ? tags
        : (
            tags
              ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
              : []
          ),

    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
const updateProduct = async (req, res) => {

  try {

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {

      return res.status(404).json({
        message: 'Product not found',
      });

    }

    const {
      name,
      category,
      price,
      stock,
      description,
      tags,
      aiCaption,
      revenue,
      unitsSold,
      imageUrl,
    } = req.body;

    // Update fields
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (description !== undefined) product.description = description;
    if (aiCaption !== undefined) product.aiCaption = aiCaption;
    if (revenue !== undefined) product.revenue = revenue;
    if (unitsSold !== undefined) product.unitsSold = unitsSold;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    if (tags !== undefined) {

      product.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);

    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private
const deleteProduct = async (req, res) => {

  try {

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {

      return res.status(404).json({
        message: 'Product not found',
      });

    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
const getProduct = async (req, res) => {

  try {

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {

      return res.status(404).json({
        message: 'Product not found',
      });

    }

    res.json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};