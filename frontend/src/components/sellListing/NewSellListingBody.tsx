import React from 'react';
import SearchField from '../searchField/SearchField';

const NewListingBody: React.FC = () => {
  return (
    <div className="m-48 w-11/12 lg:w-5/6 mx-auto mt-8 p-8 flex items-center border border-gray-200">
      <div className="w-1/2 lg:w-1/4 pb-[50%] lg:pb-[30%] bg-neutral-50 border border-stone-500"></div>
      <div className="self-start ml-12">
        <SearchField isListing={true} />
      </div>
    </div>
  );
};

export default NewListingBody;
