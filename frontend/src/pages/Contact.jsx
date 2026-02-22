import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Truck, Shield, Zap } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const dropLocations = [
    {
      name: 'Vastram Central Hub',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 938079xxxx',
      hours: '7:00 AM - 10:00 PM',
      features: ['Express Service', 'Premium Care', '24/7 Support']
    },
    {
      name: 'Vastram Koramangala',
      address: '456 Koramangala 4th Block, Bangalore 560034',
      phone: '+91 938079xxxx',
      hours: '8:00 AM - 9:00 PM',
      features: ['Standard Service', 'Quick Turnaround']
    },
    {
      name: 'Vastram Whitefield',
      address: '789 Whitefield Main Road, Bangalore 560066',
      phone: '+91 938079xxxx',
      hours: '8:00 AM - 9:00 PM',
      features: ['Premium Service', 'Bridal Care']
    },
    {
      name: 'Vastram Indiranagar',
      address: '321 100 Feet Road, Indiranagar, Bangalore 560038',
      phone: '+91 938079xxxx',
      hours: '7:30 AM - 9:30 PM',
      features: ['Express Service', 'Traditional Wear']
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us & Drop Locations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get in touch with us or visit our convenient drop-off locations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+91 938079xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Contact Info */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+91 938079xxxx</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@vastram.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Customer Support</h3>
                    <p className="text-gray-600 dark:text-gray-300">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
                Emergency Pickup
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                Need urgent pickup or have a complaint?
              </p>
              <p className="text-red-900 dark:text-red-300 font-semibold">
                📞 +91 938079xxxx
              </p>
            </div>
          </div>
        </div>

        {/* Pickup & Delivery Information */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Pickup & Delivery Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Free Pickup & Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free pickup and delivery within 10km radius of any drop location.
                Same-day pickup available before 2 PM.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Express Service
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Same day delivery available for urgent orders.
                Premium express service for time-sensitive items.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Quality Guarantee
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                100% satisfaction guarantee with damage protection.
                Eco-friendly cleaning products used.
              </p>
            </div>
          </div>
        </div>

        {/* Drop Locations */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Drop-off Locations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dropLocations.map((location, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {location.name}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {location.address}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {location.phone}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {location.hours}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {location.features.map((feature, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-blue-900 dark:text-blue-300 mb-6">
            Service Areas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Central Bangalore
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                MG Road, Indiranagar, Koramangala
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                North Bangalore
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Hebbal, Yelahanka, Sahakarnagar
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                East Bangalore
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Whitefield, Marathahalli, Electronic City
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                South Bangalore
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Jayanagar, JP Nagar, Banashankari
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;