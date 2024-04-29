import toast from 'react-hot-toast';
import ListingForm from '../../components/sellListing/ListingForm';
import { YugiohCardSellListing } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { toastMessages } from '../../constants/toast';
import { errorToast } from '../../util/errorToast';
import { useNavigate } from 'react-router-dom';

function SellListing(): JSX.Element {
  const navigate = useNavigate();
  function handleSubmit(data: YugiohCardSellListing, postAnother: boolean) {
    yugiohService
      .sellCardListing(data)
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

  return <ListingForm onSubmit={handleSubmit} />;
}

export default SellListing;
