import { useLoaderData, useNavigate } from 'react-router-dom';
import { EditListingLoaderData, YugiohCardSellListing } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';

import { toastMessages } from '../../constants/toast';
import ListingForm from '../../components/sellListing/ListingForm';
import { useToast } from '../../util/useToast';
import { useTranslation } from 'react-i18next';

function EditListing(): JSX.Element {
  const data = useLoaderData() as EditListingLoaderData;
  const { listing, listings } = data;
  const toast = useToast();
  const { t } = useTranslation('common');

  const navigate = useNavigate();
  function handleSubmit(data: YugiohCardSellListing, postAnother: boolean) {
    yugiohService
      .updateCardListing(data, listing.id)
      .then((data) => {
        toast.success({
          toastKey: toastMessages.listingEdited,
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
      cardInSet={listing.card_in_set}
      listing={listing}
      listings={listings}
      onSubmit={handleSubmit}
      editMode
      title={t('breadcrumbs.sell.editListing.title')}
    />
  );
}

export default EditListing;
