import ListingTopBar from '../../components/sellListing/ListingTopBar';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import NewListingBody from '../../components/sellListing/NewSellListingBody';

function Newlisting() {
  return (
    <>
      <ListingTopBar />
      <NewListingTopBar
        handleSubmit={(): Promise<void> => {
          throw new Error('Function not implemented.');
        }}
      />
      <NewListingBody />
    </>
  );
}

export default Newlisting;
