import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    clearError();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate('/services');
      } else {
        setError(result?.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Split layout: brand panel (left) + form card (right) */
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
            Fresh clothes, zero hassle. Premium laundry & dry cleaning at your doorstep.
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
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{' '}
                <Link
                  to="/register"
                  className="font-medium text-accent-500 hover:text-accent-600"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  <p>{error}</p>
                  {error.includes('not registered') && (
                    <Link to="/register" className="mt-2 text-accent-500 hover:text-accent-600 font-semibold inline-block">
                      Click here to Register
                    </Link>
                  )}
                </div>
              )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your password"
                />
                <div className="mt-1.5 text-right">
                  <Link to="/forgot-password" className="text-sm text-accent-500 hover:text-accent-600 font-medium">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
