import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Shield, Star, Shirt, Sparkles, Heart } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Pickup & Delivery',
      description: 'Convenient doorstep service across the city'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24-48 Hour Service',
      description: 'Quick turnaround for all your laundry needs'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Guarantee',
      description: '100% satisfaction or money back guarantee'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Premium Care',
      description: 'Expert handling of delicate and luxury items'
    }
  ];

  const serviceCategories = [
    {
      title: 'Dry Cleaning',
      description: 'Professional dry cleaning for suits, formal wear, and delicate fabrics',
      link: '/services?category=dry-cleaning',
      linkText: 'Dry Cleaning Prices →'
    },
    {
      title: 'Premium Laundry',
      description: 'Premium washing and care for your everyday clothes',
      link: '/services?category=premium-laundry',
      linkText: 'Premium Laundry Prices →'
    },
    {
      title: 'Bridal Wear',
      description: 'Special care for wedding dresses, lehengas, and traditional wear',
      link: '/services?category=bridal-wear',
      linkText: 'Bridal Wear Prices →'
    },
    {
      title: 'Home Essentials',
      description: 'Cleaning services for curtains, bedsheets, and home textiles',
      link: '/services?category=home-essentials',
      linkText: 'Home Essentials Prices →'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Blue Background */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Vastram: Professional Laundry & Dry Cleaning
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience premium laundry services with pickup and delivery. Made for better laundry experience with{' '}
            <Heart className="w-6 h-6 inline text-red-400 mx-1" />
            {' '}and care.
          </p>
          <Link
            to="/services"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
              Our Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCategories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <Link
                  to={category.link}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {category.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Vastram?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're committed to providing the best laundry experience in the city
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Premium Laundry Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your first pickup today and see the Vastram difference
          </p>
          <Link
            to="/services"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;