import React from 'react';
import { formatDate } from './Utils.tsx';

interface DateDividerProps {
  date: string;
}

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  return (
    <div className="relative mb-4 sticky top-0 bg-white z-10 rounded-b-md">
      <h2 className="relative text-xl font-semibold text-center bg-white shadow-2xl p-2 rounded-md border border-gray-300">
        {formatDate(date)}
      </h2>
    </div>
  );
};

export default DateDivider;
