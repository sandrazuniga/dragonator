import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-brand-gray border-t-2 border-brand-red/50 mt-16">
      <div className="container mx-auto py-12 px-4 text-gray-600 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">DRAGONATOR</p>
          <p>&copy; {new Date().getFullYear()} All rights reserved. Bringing the best of Japanese rock to Chile.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-brand-red transition-colors">Facebook</a>
            <a href="#" className="hover:text-brand-red transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-red transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;