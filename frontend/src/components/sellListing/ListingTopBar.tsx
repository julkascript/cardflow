import { Link } from 'react-router-dom';

function ListingTopBar() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start space-x-4">
          <Link
            to="#buy"
            className="p-4 text-gray-900 hover:text-gray-600 border-b-2 border-transparent text-sm font-medium"
          >
            Buy
          </Link>
          <Link
            to="#sell"
            className="p-4 text-gray-900 hover:text-gray-600 border-b-2 border-stone-500 text-sm font-medium"
          >
            Sell
          </Link>
          <Link
            to="#trade"
            className="p-4 text-gray-900 hover:text-gray-600 border-b-2 border-transparent text-sm font-medium"
          >
            Trade
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingTopBar;
