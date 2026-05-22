const express = require('express');

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/productController');

const {
  protect,
} = require('../middleware/auth');

// Protect all product routes
router.use(protect);

// Routes
router.route('/')

  .get(getProducts)

  .post(createProduct);

router.route('/:id')

  .get(getProduct)

  .put(updateProduct)

  .delete(deleteProduct);

module.exports = router;