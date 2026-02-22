import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Filter, Shirt, Briefcase, Crown, Sofa, Sparkles, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { servicesAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

// Category icon and color mapping
const categoryConfig = {
  shirts: {
    icon: Shirt,
    label: 'Shirts & Tops',
    gradient: 'from-blue-500 to-blue-600',
    darkGradient: 'dark:from-blue-600 dark:to-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    glow: 'hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10',
  },
  suits: {
    icon: Briefcase,
    label: 'Suits & Formal',
    gradient: 'from-indigo-500 to-indigo-600',
    darkGradient: 'dark:from-indigo-600 dark:to-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    glow: 'hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10',
  },
  traditional: {
    icon: Crown,
    label: 'Traditional Wear',
    gradient: 'from-amber-500 to-orange-500',
    darkGradient: 'dark:from-amber-600 dark:to-orange-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    glow: 'hover:shadow-amber-500/10 dark:hover:shadow-amber-400/10',
  },
  casual: {
    icon: Shirt,
    label: 'Casual Wear',
    gradient: 'from-green-500 to-emerald-500',
    darkGradient: 'dark:from-green-600 dark:to-emerald-600',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    glow: 'hover:shadow-green-500/10 dark:hover:shadow-green-400/10',
  },
  'home-essentials': {
    icon: Sofa,
    label: 'Home Essentials',
    gradient: 'from-purple-500 to-violet-500',
    darkGradient: 'dark:from-purple-600 dark:to-violet-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    glow: 'hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10',
  },
};

const getCategoryConfig = (category) =>
  categoryConfig[category] || {
    icon: Sparkles,
    label: category,
    gradient: 'from-gray-500 to-gray-600',
    darkGradient: 'dark:from-gray-600 dark:to-gray-700',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    glow: '',
  };

const Services = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const categoryMap = {
      'dry-cleaning': 'suits',
      'premium-laundry': 'shirts',
      'bridal-wear': 'traditional',
      'home-essentials': 'home-essentials',
    };

    if (categoryParam && categoryMap[categoryParam]) {
      setSelectedCategory(categoryMap[categoryParam]);
    } else if (
      categoryParam &&
      ['suits', 'shirts', 'traditional', 'casual', 'home-essentials'].includes(categoryParam)
    ) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesAPI.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to load services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const handleAddToCart = async (service) => {
    try {
      await addItem({
        id: service._id,
        name: service.name,
        price: service.price,
        category: service.category,
        processingTime: service.processingTime,
      });
      alert(`${service.name} added to cart - ₹${service.price}`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const categoryOptions = [
    { id: 'all', icon: Sparkles, name: 'All Services' },
    { id: 'shirts', icon: Shirt, name: 'Shirts & Tops' },
    { id: 'suits', icon: Briefcase, name: 'Suits & Formal' },
    { id: 'traditional', icon: Crown, name: 'Traditional Wear' },
    { id: 'casual', icon: Shirt, name: 'Casual Wear' },
    { id: 'home-essentials', icon: Sofa, name: 'Home Essentials' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading services..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ErrorMessage message={error} onRetry={loadServices} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Professional laundry and dry cleaning services with transparent pricing
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const config = getCategoryConfig(service.category);
            const CategoryIcon = config.icon;
            return (
              <div
                key={service._id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 ring-1 ring-gray-200 dark:ring-gray-700 hover:shadow-xl ${config.glow} transition-all duration-300 flex flex-col`}
              >
                {/* Icon + Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} ${config.darkGradient} flex items-center justify-center shadow-lg`}
                  >
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${config.badge}`}>
                    {config.label}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.processingTime}</span>
                  </div>
                </div>

                {/* Price + Add */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                      ₹{service.price}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">/ item</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(service)}
                    className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md shadow-accent-500/20 hover:shadow-accent-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No services found in this category.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/10 rounded-2xl p-8 ring-1 ring-primary-100 dark:ring-primary-800/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Pickup & Delivery
              </h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Free pickup and delivery within city limits</li>
                <li>• Same-day pickup available (before 2 PM)</li>
                <li>• Express delivery available for urgent orders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quality Guarantee
              </h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• 100% satisfaction guarantee</li>
                <li>• Damage protection for all items</li>
                <li>• Eco-friendly cleaning products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;