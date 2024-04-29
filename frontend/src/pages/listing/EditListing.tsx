import { useLoaderData, useNavigate } from 'react-router-dom';
import { EditListingLoaderData, YugiohCardSellListing } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';

import { errorToast } from '../../util/errorToast';
import toast from 'react-hot-toast';
import { toastMessages } from '../../constants/toast';
import ListingForm from '../../components/sellListing/ListingForm';

function EditListing(): JSX.Element {
  const data = useLoaderData() as EditListingLoaderData;
  const { listing, listings } = data;

  const navigate = useNavigate();
  function handleSubmit(data: YugiohCardSellListing, postAnother: boolean) {
    yugiohService
      .updateCardListing(data, listing.id)
      .then((data) => {
        toast.success(
          toastMessages.success.listingCreated(data.card_name, data.card_in_set.set.set_code),
        );
        if (postAnother) {
          navigate('/sell/new');
        } else {
          navigate('/sell/manage');
        }
      })
      .catch(errorToast);
  }

  return (
    <ListingForm
      cardInSet={listing.card_in_set}
      listing={listing}
      listings={listings}
      onSubmit={handleSubmit}
      editMode
    />
  );
}

export default EditListing;
