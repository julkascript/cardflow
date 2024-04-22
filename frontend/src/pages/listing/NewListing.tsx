import CardflowTabs from '../../components/sellListing/ListingTopBar';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import NewListingBody from '../../components/sellListing/NewSellListingBody';

function Newlisting() {
  return (
    <>
      <CardflowTabs />
      <NewListingTopBar
        card={0}
        quantity={0}
        price={0}
        condition={'poor'}
        handleSubmit={(): Promise<void> => {
          throw new Error('Function not implemented.');
        }}
      />
      <NewListingBody />
    </>
  );
}

export default Newlisting;
