import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — custom V monogram replaces generic shirt icon */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <Logo size={36} className="transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              Vastram
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Services
            </Link>
            {/* "Book Now" — styled as a filled accent button for visual weight as the main CTA */}
            <Link
              to="/checkout"
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-accent-500/20 hover:shadow-lg hover:shadow-accent-500/30"
            >
              Book Now
            </Link>
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
