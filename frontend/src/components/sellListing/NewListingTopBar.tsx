import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { condition } from '../../services/yugioh/types';
import BreadcrumbNavigation, { BreadcrumbLink } from '../BreadcrumbNavigation';

type NewListingTopBarProps = {
  handleSubmit: (e: React.FormEvent, postAnother: boolean) => Promise<void>;
  quantity: number;
  price: number;
  condition: condition;
  card: number;
};

const NewListingTopBar: React.FC<NewListingTopBarProps> = ({
  handleSubmit,
  quantity,
  price,
  condition,
  card,
}) => {
  const [postAnother, setPostAnother] = useState(false);
  const navigate = useNavigate();
  const isButtonDisabled =
    quantity === null ||
    quantity === 0 ||
    price == null ||
    price === 0 ||
    price === undefined ||
    condition === null ||
    condition === undefined;
  card === null || card === undefined;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostAnother(e.target.checked);
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, postAnother);
    if (!postAnother) {
      navigate('/sell/manage');
    } else {
      navigate('/sell/new');
    }
  };

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/sell/manage',
      text: 'Sell',
    },
  ];

  return (
    <BreadcrumbNavigation links={breadcrumbNavigation} heading="New Listing">
      {/* TO-DO: update URL */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="post-another"
          className="form-checkbox"
          checked={postAnother}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="post-another" className="ml-2 mr-4 text-sm text-gray-700">
          Post another
        </label>
        <Link
          to="/sell/manage"
          className="px-6 py-1 mr-6 text-black border border-black rounded-lg hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          onClick={onSubmit}
          className="mr-48 px-6 py-1 text-white bg-emerald-500 border border-emerald-600 rounded-lg hover:bg-emerald-400 focus:outline-none focus:ring-blue-500"
          disabled={isButtonDisabled}
        >
          Post
        </button>
      </div>
    </BreadcrumbNavigation>
  );
};

export default NewListingTopBar;
