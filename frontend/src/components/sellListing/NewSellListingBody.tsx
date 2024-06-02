import React from 'react';
import SearchField from '../searchField/SearchField';

const NewListingBody: React.FC = () => {
  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-8">
      <div className="bg-white w-11/12 lg:w-5/6 lg:gap-0 gap-4 mx-auto p-8 flex flex-col lg:flex-row items-center border">
        <div className="w-1/2 lg:w-1/4 pb-[50%] lg:pb-[30%] bg-neutral-50 border border-stone-500"></div>
        <div className="md:self-start lg:ml-12 mx-auto">
          <SearchField isListing={true} />
        </div>
      </div>
    </div>
  );
};

export default NewListingBody;
