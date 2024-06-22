import { useTranslation } from 'react-i18next';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import NewListingBody from '../../components/sellListing/NewSellListingBody';

function Newlisting() {
  const { t } = useTranslation('sell');
  return (
    <>
      <CardflowTabs />
      <NewListingTopBar
        quantity={0}
        price={0}
        handleSubmit={(): Promise<void> => {
          throw new Error('Function not implemented.');
        }}
        title={t('newListing.title')}
      />
      <NewListingBody />
    </>
  );
}

export default Newlisting;
