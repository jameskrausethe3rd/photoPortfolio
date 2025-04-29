import React from 'react';
import { formatDate } from './Utils.tsx';

interface DateDividerProps {
  date: string;
}

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  return (
    <div className="rounded-b-lg shadow-lg/20 bg-white dark:bg-gray-800">
      <h2 className="relative text-xl font-semibold text-center p-4">
        {formatDate(date)}
      </h2>
    </div>
  );
};

export default DateDivider;
