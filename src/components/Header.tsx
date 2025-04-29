import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-left p-6 bg-gray-100 dark:bg-gray-800 shadow-xl/20 text-center sm:text-left">
      <h1 className="text-2xl sm:text-2xl font-bold w-full">
        Car Portfolio
      </h1>
    </header>
  );
};

export default Header;
