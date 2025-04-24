import React from 'react';
import { formatDate } from './Utils.tsx';

interface DateDividerProps {
  date: string;
}

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  return (
    <div>
      <h2 className="relative text-xl font-semibold text-center bg-white dark:bg-gray-800 p-4 rounded-md border dark:border border-gray-300 dark:border-gray-1000">
        {formatDate(date)}
      </h2>
    </div>
  );
};

export default DateDivider;
