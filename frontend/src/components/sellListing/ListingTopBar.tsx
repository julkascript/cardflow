import { Link, useLocation } from 'react-router-dom';

function ListingTopBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start space-x-4">
          <Link
            to="/search"
            className={`p-4 text-gray-900 hover:text-gray-600  text-sm font-medium ${
              currentPath === '/search' && 'border-b-2 border-stone-500'
            }`}
          >
            Buy
          </Link>
          <Link
            to="/sell/manage"
            className={`p-4 text-gray-900 hover:text-gray-600  text-sm font-medium ${
              currentPath.includes('/sell') && 'border-b-2 border-stone-500'
            }`}
          >
            Sell
          </Link>
          <Link to="#trade" className="p-4 text-gray-900 hover:text-gray-600  text-sm font-medium">
            Trade
          </Link>
          <Link
            to="/about"
            className={`p-4 text-gray-900 hover:text-gray-600  text-sm font-medium ${
              currentPath.includes('/about') && 'border-b-2 border-stone-500'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingTopBar;
