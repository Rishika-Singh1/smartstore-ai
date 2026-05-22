const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Electronics',
        'Fashion',
        'Home & Garden',
        'Sports',
        'Beauty',
        'Books',
        'Toys',
        'Food',
        'Other',
      ],
      default: 'Other',
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: '',
    },

    tags: {
      type: [String],
      default: [],
    },

    aiCaption: {
      type: String,
      default: '',
    },

    revenue: {
      type: Number,
      default: 0,
    },

    unitsSold: {
      type: Number,
      default: 0,
    },

    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);