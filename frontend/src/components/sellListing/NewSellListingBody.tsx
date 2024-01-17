import React from 'react';
import SearchField from '../searchField/SearchField';

const NewListingBody: React.FC = () => {
  return (
    <div className="m-48 mt-8 p-20 pt-8 flex items-center bg-white border border-gray-200">
      <div className="flex justify-around items-center w-[162px] h-[237px] bg-neutral-50 border border-stone-500">
        <img src="/images/new-lising-questionmark.png" />
      </div>
      <div className="self-start ml-12">
        <SearchField isListing={true} />
      </div>
    </div>
  );
};

export default NewListingBody;
