import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type NewListingTopBarProps = {
  handleSubmit: (e: React.FormEvent, postAnother: boolean) => Promise<void>;
};

const NewListingTopBar: React.FC<NewListingTopBarProps> = ({ handleSubmit }) => {
  const [postAnother, setPostAnother] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostAnother(e.target.checked);
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, postAnother);
    if (!postAnother) {
      navigate('/listing/newlisting');
    }
  };

  return (
    <div className="py-8 flex justify-between items-center bg-white border-b border-gray-200">
      <span className="ml-40 text-4xl font-semibold text-gray-900">
        <span className="text-stone-500 font-normal">Sell</span> / New Listing
      </span>
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
        <button className="px-6 py-1 mr-6 text-black border border-black rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="mr-48 px-6 py-1 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-400 focus:outline-none focus:ring-blue-500"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default NewListingTopBar;
