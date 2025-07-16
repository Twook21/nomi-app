import React from 'react';
import { Bell } from 'lucide-react';
import UserMenu from './UserMenu'; 

const Header = () => {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-end px-6">
      <div className="flex items-center space-x-2"> {/* Mengurangi space-x */}
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;