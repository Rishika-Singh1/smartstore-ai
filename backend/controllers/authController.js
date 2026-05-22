const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
const register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {

      return res.status(400).json({
        message: 'Please provide name, email and password',
      });

    }

    if (password.length < 6) {

      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });

    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: 'Email already registered',
      });

    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message: 'Please provide email and password',
      });

    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(401).json({
        message: 'Invalid email or password',
      });

    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {

      return res.status(401).json({
        message: 'Invalid email or password',
      });

    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });

  }

};

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
const getMe = async (req, res) => {

  res.json({
    success: true,
    user: req.user,
  });

};

module.exports = {
  register,
  login,
  getMe,
};