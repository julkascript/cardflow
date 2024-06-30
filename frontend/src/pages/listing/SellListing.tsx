import ListingForm from '../../components/sellListing/ListingForm';
import { CardDetailsLoaderData, YugiohCardSellListing } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { toastMessages } from '../../constants/toast';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useToast } from '../../util/useToast';

function SellListing(): JSX.Element {
  const navigate = useNavigate();
  const data = useLoaderData() as CardDetailsLoaderData;
  const toast = useToast();

  function handleSubmit(data: YugiohCardSellListing, postAnother: boolean) {
    yugiohService
      .sellCardListing(data)
      .then((data) => {
        toast.success({
          toastKey: toastMessages.listingCreated,
          values: { name: data.card_name, setCode: data.card_in_set.set.set_code },
        });

        if (postAnother) {
          navigate('/sell/new');
        } else {
          navigate('/sell/manage');
        }
      })
      .catch((error) => toast.error({ error }));
  }

  return (
    <ListingForm
      title="New listing"
      cardInSet={data.cardInSet}
      listings={data.cardListings}
      onSubmit={handleSubmit}
    />
  );
}

export default SellListing;
