import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, Shield, Star, Shirt, Briefcase, Crown, Palette, Sofa } from 'lucide-react';

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

  /* Category cards now include icons matching Services.jsx for visual consistency */
  const serviceCategories = [
    {
      title: 'Dry Cleaning',
      description: 'Professional dry cleaning for suits, formal wear, and delicate fabrics',
      link: '/services?category=dry-cleaning',
      linkText: 'Dry Cleaning Prices →',
      icon: <Briefcase className="w-6 h-6" />,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Premium Laundry',
      description: 'Premium washing and care for your everyday clothes',
      link: '/services?category=premium-laundry',
      linkText: 'Premium Laundry Prices →',
      icon: <Shirt className="w-6 h-6" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Bridal Wear',
      description: 'Special care for wedding dresses, lehengas, and traditional wear',
      link: '/services?category=bridal-wear',
      linkText: 'Bridal Wear Prices →',
      icon: <Crown className="w-6 h-6" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Home Essentials',
      description: 'Cleaning services for curtains, bedsheets, and home textiles',
      link: '/services?category=home-essentials',
      linkText: 'Home Essentials Prices →',
      icon: <Sofa className="w-6 h-6" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — gradient background with decorative dot pattern and wave divider */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 px-4 overflow-hidden">
        {/* Decorative dot pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Vastram: Professional Laundry & Dry Cleaning
          </h1>
          {/* Removed raw emoji heart — clean copy reads more premium */}
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience premium laundry services with free pickup and delivery. Made for a better laundry experience with expert care.
          </p>
          {/* Dual CTA: primary Book Now + secondary ghost See Pricing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 active:scale-[0.98]"
            >
              Book Now
            </Link>
            <Link
              to="/services"
              className="inline-block border-2 border-white/30 hover:border-white/60 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              See Pricing →
            </Link>
          </div>
        </div>

        {/* Wave divider — smooth curve transition into next section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" className="fill-gray-50 dark:fill-gray-900" />
          </svg>
        </div>
      </section>

      {/* Our Services Section — category cards now have icons and unified card styling */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-500 mb-4">
              Our Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <div key={index} className="card p-6 hover:shadow-xl group">
                {/* Category icon badge — matches Services page icon treatment */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${category.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed text-sm">
                  {category.description}
                </p>
                <Link
                  to={category.link}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors text-sm"
                >
                  {category.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section — "Why Choose Vastram" — kept as visual reference/template */}
      <section className="py-20 bg-white dark:bg-gray-800">
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
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-4 transition-transform duration-200 group-hover:scale-110">
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

      {/* CTA Section — with wave divider at top */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Wave divider at top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" className="fill-white dark:fill-gray-800" />
          </svg>
        </div>
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Premium Laundry Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your first pickup today and see the Vastram difference
          </p>
          <Link
            to="/services"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-lg shadow-accent-500/30 hover:shadow-xl active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;