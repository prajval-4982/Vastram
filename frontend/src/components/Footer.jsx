import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Shirt className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Vastram
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Premium laundry & dry cleaning services. We treat your garments with the care they deserve.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/services', label: 'Services' },
                                { to: '/checkout', label: 'Book Now' },
                                { to: '/contact', label: 'Contact Us' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Our Services
                        </h3>
                        <ul className="space-y-3">
                            {['Shirts & Tops', 'Suits & Formals', 'Traditional Wear', 'Casual Wear', 'Home Essentials'].map(
                                (service) => (
                                    <li key={service}>
                                        <Link
                                            to="/services"
                                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                        >
                                            {service}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Get in Touch
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">+91 938079xxxx</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">support@vastram.com</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Bangalore, Karnataka, India
                                </span>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex space-x-4 mt-6">
                            {[
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Facebook, label: 'Facebook' },
                                { icon: Twitter, label: 'Twitter' },
                            ].map(({ icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} Vastram. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 sm:mt-0">
                        Made with ❤️ in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
