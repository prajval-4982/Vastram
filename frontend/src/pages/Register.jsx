import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.address?.trim()) errors.address = 'Address is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: formData.address.trim()
      });

      if (result.success) {
        navigate('/services');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle field-specific validation errors from the API
      if (err.errors) {
        setFieldErrors(err.errors);
        setError('Please fix the validation errors');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `block w-full px-4 py-2.5 border ${
      fieldErrors[fieldName] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 dark:bg-gray-700 dark:text-white transition-colors`;

  return (
    /* Split layout: brand panel (left) + form card (right) — same treatment as Login */
    <div className="min-h-screen flex">
      {/* Brand Panel — gradient with logo and tagline */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Decorative dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <Logo size={80} className="mb-6" />
          <h2 className="text-4xl font-bold text-white mb-3">Vastram</h2>
          <p className="text-blue-200 text-lg text-center max-w-sm leading-relaxed">
            Join thousands of happy customers. Premium laundry care is just a click away.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          {/* Mobile logo — visible only on smaller screens */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="flex items-center space-x-2.5">
              <Logo size={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Vastram</span>
            </Link>
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{' '}
                <Link
                  to="/login"
                  className="font-medium text-accent-500 hover:text-accent-600"
                >
                  sign in to your existing account
                </Link>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="Enter your email"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass('phone')}
                  placeholder="Enter your phone number"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass('address')}
                  placeholder="Enter your full address"
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass('password')}
                  placeholder="Enter your password"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass('confirmPassword')}
                  placeholder="Confirm your password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
