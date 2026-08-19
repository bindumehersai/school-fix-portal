const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// ==========================================
// POST /api/auth/register
// ==========================================
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    schoolId,
  } = req.body;

  // Clean the email before saving
  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    schoolId: schoolId ? schoolId.trim() : '',
  });

  // Send response
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    schoolId: user.schoolId,
    token: generateToken(user._id),
  });
});

// ==========================================
// POST /api/auth/login
// ==========================================
const login = asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // Clean email
  const normalizedEmail = email.trim().toLowerCase();

  // Find user and explicitly include password
  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password');

  // User does not exist
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Compare entered password with hashed password
  const passwordMatch = await user.matchPassword(password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Login successful
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    schoolId: user.schoolId,
    token: generateToken(user._id),
  });
});

module.exports = {
  register,
  login,
};