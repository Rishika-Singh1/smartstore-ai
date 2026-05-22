const { GoogleGenerativeAI } = require('@google/generative-ai');

const Product = require('../models/Product');

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// @route   POST /api/ai/generate-content
// @desc    Generate product content using AI
// @access  Private
const generateContent = async (req, res) => {

  try {

    const {
      productName,
      category,
      features,
      targetAudience,
      price,
    } = req.body;

    if (!productName) {

      return res.status(400).json({
        message: 'Product name is required',
      });

    }

    const prompt = `
You are an expert e-commerce copywriter.

Generate product content for:

Product: ${productName}
Category: ${category || 'General'}
Price: ${price || 'Not specified'}
Features: ${features || 'Standard features'}
Target Audience: ${targetAudience || 'General audience'}

Return ONLY valid JSON in this exact format:

{
  "description": "Product description",
  "tags": ["tag1", "tag2", "tag3"],
  "caption": "Marketing caption"
}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json({
      success: true,
      content: parsed,
    });

  } catch (error) {

    res.status(500).json({
      message: 'AI content generation failed',
      error: error.message,
    });

  }

};

// @route   POST /api/ai/generate-insights
// @desc    Generate AI business insights
// @access  Private
const generateInsights = async (req, res) => {

  try {

    const products = await Product.find({
      user: req.user._id,
    });

    if (!products.length) {

      return res.status(400).json({
        message: 'Add products first to generate insights',
      });

    }

    const productSummary = products.map(product =>

      `Product: ${product.name}
Category: ${product.category}
Price: ${product.price}
Stock: ${product.stock}
Revenue: ${product.revenue}
Units Sold: ${product.unitsSold}`

    ).join('\n\n');

    const prompt = `
You are an AI business analyst.

Analyze this e-commerce data and provide insights.

${productSummary}

Return ONLY valid JSON:

{
  "pricingRecommendations": [
    "recommendation 1",
    "recommendation 2"
  ],

  "trendingInsights": [
    "trend 1",
    "trend 2"
  ],

  "inventoryAlerts": [
    "alert 1",
    "alert 2"
  ],

  "overallSummary": "Overall business summary"
}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json({
      success: true,
      insights: parsed,
    });

  } catch (error) {

    res.status(500).json({
      message: 'AI insights generation failed',
      error: error.message,
    });

  }

};

// @route   POST /api/ai/apply-content/:productId
// @desc    Apply AI content to product
// @access  Private
const applyContentToProduct = async (req, res) => {

  try {

    const {
      description,
      tags,
      caption,
    } = req.body;

    const product = await Product.findOne({
      _id: req.params.productId,
      user: req.user._id,
    });

    if (!product) {

      return res.status(404).json({
        message: 'Product not found',
      });

    }

    if (description) {
      product.description = description;
    }

    if (tags) {
      product.tags = tags;
    }

    if (caption) {
      product.aiCaption = caption;
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'AI content applied successfully',
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

module.exports = {
  generateContent,
  generateInsights,
  applyContentToProduct,
};