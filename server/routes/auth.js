const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Generate JWT token (no expiry for persistent sessions)
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user for Vastram services
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Please provide a phone number'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email in Vastram system'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'Welcome to Vastram! Your account has been created successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          membershipTier: user.membershipTier,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create Vastram account. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user to Vastram services
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not registered. Please create an account first to login.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your Vastram account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password for Vastram account'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      message: 'Welcome back to Vastram!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          membershipTier: user.membershipTier,
          role: user.role,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          address: req.user.address,
          membershipTier: req.user.membershipTier,
          role: req.user.role,
          totalOrders: req.user.totalOrders,
          totalSpent: req.user.totalSpent,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Vastram profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    message: 'Successfully logged out from Vastram. Thank you for using our services!'
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP to email
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No account found with this email address.'
      });
    }

    // Generate 6-digit OTP
    const crypto = require('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP and expiry (15 minutes)
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // 🔴 FALLBACK FOR LOCAL TESTING: Log OTP to terminal if email is not configured 🔴
    console.log(`\n========================================`);
    console.log(`🔐 PASSWORD RESET OTP FOR ${email}: ${otp}`);
    console.log(`========================================\n`);

    // Only attempt to send email if valid credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Vastram" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Vastram - Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 16px;">Password Reset</h2>
            <p style="color: #374151; font-size: 15px;">Hi ${user.name},</p>
            <p style="color: #374151; font-size: 15px;">Your OTP for password reset is:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px;">This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
            <p style="color: #6b7280; font-size: 13px;">— Team Vastram</p>
          </div>
        `,
      });
    } else {
      console.log('⚠️ Email credentials not fully configured in .env. Email was NOT sent. Check terminal for OTP.');
    }

    res.json({
      status: 'success',
      message: 'Password reset OTP generated. Please check your email (or the server terminal if testing locally).'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send reset email. Please try again later.'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post('/reset-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password reset successfully! You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password. Please try again.'
    });
  }
});

module.exports = router;