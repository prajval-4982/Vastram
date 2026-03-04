const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid amount',
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `vastram_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        userName: req.user.name,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment order',
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing payment verification details',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        },
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed. Invalid signature.',
      });
    }
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Payment verification failed',
    });
  }
});

module.exports = router;
