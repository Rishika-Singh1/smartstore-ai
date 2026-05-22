const express = require('express');

const router = express.Router();

const {
  generateContent,
  generateInsights,
  applyContentToProduct,
} = require('../controllers/aiController');

const {
  protect,
} = require('../middleware/auth');

// Protect all AI routes
router.use(protect);

// AI Content Generation
router.post('/generate-content', generateContent);

// AI Business Insights
router.post('/generate-insights', generateInsights);

// Apply AI Content To Product
router.post('/apply-content/:productId', applyContentToProduct);

module.exports = router;