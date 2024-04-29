import CardflowTabs from '../../components/sellListing/CardflowTabs';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import NewListingBody from '../../components/sellListing/NewSellListingBody';

function Newlisting() {
  return (
    <>
      <CardflowTabs />
      <NewListingTopBar
        quantity={0}
        price={0}
        handleSubmit={(): Promise<void> => {
          throw new Error('Function not implemented.');
        }}
      />
      <NewListingBody />
    </>
  );
}

export default Newlisting;
