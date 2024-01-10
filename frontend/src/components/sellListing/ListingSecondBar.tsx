import React from 'react';
import { Link } from 'react-router-dom';

const SubNavBar: React.FC = () => {
  return (
    <div className="py-8 flex justify-between items-center bg-white border-b border-gray-200">
      <span className="ml-40 text-4xl font-semibold text-gray-900">Sell</span>
      <Link
        to="/listing/newlisting"
        className="mr-40 px-2 py-1 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-400 focus:outline-none focus:ring-blue-500"
      >
        + New Listing
      </Link>
    </div>
  );
};

export default SubNavBar;
