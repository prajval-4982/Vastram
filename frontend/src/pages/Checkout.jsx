
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Loader, CreditCard, Banknote, Smartphone, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, paymentAPI } from '../services/api';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupAddress: user?.address || '',
    pickupDate: '',
    pickupTime: '10:00',
    deliveryAddress: user?.address || '',
    specialInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');
  // Card/UPI data entry is handled inside Razorpay's own secure modal

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = details, 2 = payment, 3 = success
  const [orderResult, setOrderResult] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  useEffect(() => {
    if (!user) navigate('/login');
    else if (items.length === 0 && step !== 3) navigate('/cart');
  }, [user, items, navigate, step]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!user || (items.length === 0 && step !== 3)) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') formatted = formatCardNumber(value);
    if (name === 'expiry') formatted = formatExpiry(value);
    if (name === 'cvv') formatted = value.replace(/[^0-9]/g, '').substring(0, 3);

    setCardData(prev => ({ ...prev, [name]: formatted }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setError('');

    // Validate addresses meet backend minimum (10 chars)
    if (formData.pickupAddress.trim().length < 10) {
      setError('Pickup address must be at least 10 characters long.');
      return;
    }
    if (formData.deliveryAddress.trim().length < 10) {
      setError('Delivery address must be at least 10 characters long.');
      return;
    }
    if (!formData.pickupDate) {
      setError('Please select a pickup date.');
      return;
    }
    // Ensure pickup date is in the future
    const selectedDate = new Date(formData.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      setError('Pickup date must be in the future.');
      return;
    }

    setStep(2);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (rzpOrderData) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: rzpOrderData.keyId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: 'Vastram',
        description: 'Vastram Laundry Services',
        order_id: rzpOrderData.orderId,
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled by user. You can try again or select Cash on Delivery.'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        reject(new Error(response.error?.description || 'Payment failed. Please try again.'));
      });
      rzp.open();
    });
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For non-COD methods, process Razorpay payment
      if (paymentMethod !== 'cash') {
        setPaymentProcessing(true);

        // Step 1: Create Razorpay order on backend
        const rzpOrder = await paymentAPI.createOrder(total);

        // Step 2: Open Razorpay checkout modal
        const paymentResponse = await openRazorpayCheckout(rzpOrder.data);

        // Step 3: Verify payment on backend
        await paymentAPI.verifyPayment({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        });

        setPaymentProcessing(false);
      }

      const orderData = {
        items: items.map(item => ({
          service: item.id,
          quantity: item.quantity
        })),
        pickupAddress: formData.pickupAddress,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        deliveryAddress: formData.deliveryAddress,
        specialInstructions: formData.specialInstructions,
        paymentMethod: paymentMethod
      };

      const response = await ordersAPI.createOrder(orderData);
      await clearCart();

      setOrderResult(response.data?.order || response.order || response);
      setStep(3);
    } catch (error) {
      console.error('Order creation failed:', error);
      setPaymentProcessing(false);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const paymentMethods = [
    { id: 'cash', label: 'Cash on Delivery', icon: Banknote, color: 'green', desc: 'Pay when your order is delivered' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'blue', desc: 'Pay securely with your card' },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone, color: 'purple', desc: 'Pay using Google Pay, PhonePe, etc.' },
  ];

  // ── Step 3: Order Success ──
  if (step === 3) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="card p-10">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your order has been placed successfully. We will contact you for pickup confirmation.
            </p>

            {orderResult?.orderNumber && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-wide">
                  {orderResult.orderNumber}
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Payment Method</p>
              <p className="text-blue-700 dark:text-blue-400 text-sm capitalize">{paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI'}</p>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-3 mb-1">Total Amount</p>
              <p className="text-blue-700 dark:text-blue-400 font-bold text-lg">₹{total}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/services')}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>1</div>
            <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>Details</span>
          </div>
          <div className={`w-16 h-0.5 mx-3 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>2</div>
            <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>Payment</span>
          </div>
          <div className={`w-16 h-0.5 mx-3 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>3</div>
            <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>Done</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {step === 1 ? 'Pickup & Delivery Details' : 'Choose Payment Method'}
        </h1>

        {/* ── Step 1: Pickup & Delivery Details ── */}
        {step === 1 && (
          <form onSubmit={handleContinueToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" /> Pickup Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pickup Address
                    </label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      required
                      minLength={10}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter complete pickup address (min 10 characters)"
                    />
                    <p className="text-xs text-gray-400 mt-1">{formData.pickupAddress.length}/10 characters minimum</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" /> Pickup Date
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        min={minDate}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" /> Pickup Time
                      </label>
                      <select
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delivery Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      required
                      minLength={10}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter complete delivery address (min 10 characters)"
                    />
                    <p className="text-xs text-gray-400 mt-1">{formData.deliveryAddress.length}/10 characters minimum</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Any special handling instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Step 1 */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">GST (18%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-primary-600 dark:text-primary-400">₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-6 flex items-center justify-center"
                >
                  Continue to Payment
                </button>

                <Link
                  to="/cart"
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-3 text-center block text-sm"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </form>
        )}

        {/* ── Step 2: Payment Method ── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Select Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === pm.id
                        ? `border-${pm.color}-500 bg-${pm.color}-50 dark:bg-${pm.color}-900/20 shadow-md`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${paymentMethod === pm.id
                        ? `bg-${pm.color}-100 dark:bg-${pm.color}-900/40`
                        : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                        <pm.icon className={`w-6 h-6 ${paymentMethod === pm.id
                          ? `text-${pm.color}-600 dark:text-${pm.color}-400`
                          : 'text-gray-400'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${paymentMethod === pm.id
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                          }`}>{pm.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{pm.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id
                        ? `border-${pm.color}-500 bg-${pm.color}-500`
                        : 'border-gray-300 dark:border-gray-600'
                        }`}>
                        {paymentMethod === pm.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* For Card/UPI — Razorpay's own secure modal handles all data entry */}
              {(paymentMethod === 'card' || paymentMethod === 'upi') && (
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <Lock className="w-5 h-5 text-green-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {paymentMethod === 'card' ? 'Pay via Card' : 'Pay via UPI'}
                    </h2>
                    <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                      🔒 Razorpay Secured
                    </span>
                  </div>

                  {/* Razorpay info banner */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/40 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-9 h-9 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      Razorpay Secure Payment
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Click <strong>"Pay ₹{total}"</strong> to open the Razorpay payment gateway.
                      {paymentMethod === 'card'
                        ? ' Enter your card details securely inside the Razorpay window.'
                        : ' Choose your UPI app (Google Pay, PhonePe, BHIM) or enter your UPI ID inside the Razorpay window.'}
                    </p>
                    {paymentMethod === 'upi' && (
                      <div className="flex items-center justify-center gap-3 mt-2">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-center text-sm font-bold text-green-600">G</div>
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-center text-sm font-bold text-purple-600">P</div>
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-center text-sm font-bold text-blue-600">B</div>
                        <span className="text-xs text-gray-400 ml-1">& more</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-4 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Your payment info is never stored on our servers. Powered by Razorpay.
                  </p>
                </div>
              )}

              {/* COD Info */}
              {paymentMethod === 'cash' && (
                <div className="card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Banknote className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cash on Delivery</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Pay <span className="font-bold text-primary-600 dark:text-primary-400">₹{total}</span> in cash when your clean laundry is delivered to your doorstep. No advance payment required!
                      </p>
                      <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" /> No extra charges for COD
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Step 2 */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">GST (18%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-primary-600 dark:text-primary-400">₹{total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isLoading || paymentProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {paymentMethod === 'cash' ? `Place Order — ₹${total}` : `Pay ₹${total}`}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-3 text-center block text-sm"
                >
                  ← Back to Details
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
