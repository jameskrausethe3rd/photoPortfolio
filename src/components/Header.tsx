import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-left p-6 bg-gray-100 dark:bg-gray-800 shadow-xl/20 text-center sm:text-left">
      <h1 className="text-2xl sm:text-2xl font-bold w-full">
        Car Portfolio
      </h1>
      <div className="mt-4 sm:mt-0 sm:ml-auto">
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
