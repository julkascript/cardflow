import { Button, Chip } from '@mui/material';
import { useTrade } from '../../../../../context/trade';
import { TradeParticipant } from '../../../../../services/trade/types';
import { YugiohCardListing } from '../../../../../services/yugioh/types';

type TradeListingImageProps = {
  listing: YugiohCardListing;
  user: TradeParticipant;
};

function TradeListingImage(props: TradeListingImageProps): JSX.Element {
  const { removeInitiatorListingOrCash, removeRecipientListingOrCash } = useTrade();

  const remove =
    props.listing.user === props.user.id
      ? removeRecipientListingOrCash
      : removeInitiatorListingOrCash;

  return (
    <div className="w-[245px] flex-shrink-0 flex-grow-0 basis-[245px]">
      <img className="min-w-full h-[356px]" src={props.listing.card_in_set.yugioh_card.image} />
      <h4 className="font-bold">{props.listing.card_name}</h4>
      <div>
        <div>
          <Chip label={props.listing.card_in_set.set.set_code} />
          <Chip label={props.listing.card_in_set.rarity.rarity} />
        </div>
        <Button color="error" variant="outlined" onClick={() => remove(props.listing)}>
          Remove
        </Button>
      </div>
    </div>
  );
}

export default TradeListingImage;
