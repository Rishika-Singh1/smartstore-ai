const Product = require('../models/Product');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
const getStats = async (req, res) => {

  try {

    const products = await Product.find({
      user: req.user._id,
    });

    // Empty state
    if (!products.length) {

      return res.json({
        success: true,

        totalRevenue: 0,
        totalProducts: 0,
        avgPrice: 0,

        topProduct: null,

        lowStockProducts: [],

        revenueByCategory: {},

        productsByCategory: {},

        recentProducts: [],
      });

    }

    // Total Revenue
    const totalRevenue = products.reduce(

      (sum, product) => sum + (product.revenue || 0),

      0

    );

    // Average Price
    const avgPrice = products.reduce(

      (sum, product) => sum + product.price,

      0

    ) / products.length;

    // Top Revenue Product
    const topProduct = products.reduce(

      (a, b) =>

        (b.revenue || 0) > (a.revenue || 0)

          ? b

          : a

    );

    // Low Stock Products
    const lowStockProducts = products

      .filter(product => product.stock <= 5)

      .map(product => ({

        id: product._id,

        name: product.name,

        stock: product.stock,

      }));

    // Revenue By Category
    const revenueByCategory = {};

    // Product Count By Category
    const productsByCategory = {};

    products.forEach(product => {

      revenueByCategory[product.category] =

        (revenueByCategory[product.category] || 0)

        + (product.revenue || 0);

      productsByCategory[product.category] =

        (productsByCategory[product.category] || 0)

        + 1;

    });

    // Recent Products
    const recentProducts = products

      .sort(

        (a, b) =>

          new Date(b.createdAt)

          - new Date(a.createdAt)

      )

      .slice(0, 5)

      .map(product => ({

        id: product._id,

        name: product.name,

        price: product.price,

        category: product.category,

        createdAt: product.createdAt,

      }));

    // Final Response
    res.json({

      success: true,

      totalRevenue: parseFloat(
        totalRevenue.toFixed(2)
      ),

      totalProducts: products.length,

      avgPrice: parseFloat(
        avgPrice.toFixed(2)
      ),

      topProduct: topProduct

        ? {

            name: topProduct.name,

            revenue: topProduct.revenue,

          }

        : null,

      lowStockProducts,

      revenueByCategory,

      productsByCategory,

      recentProducts,

    });

  } catch (error) {

    res.status(500).json({

      message: 'Server error',

      error: error.message,

    });

  }

};

module.exports = {
  getStats,
};