import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center">
                {/* Large 404 */}
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500 select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Page Not Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been moved or the URL is incorrect.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <Link
                        to="/services"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Browse Services
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
