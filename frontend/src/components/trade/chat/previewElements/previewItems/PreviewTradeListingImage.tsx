import { Tooltip } from '@mui/material';
import { YugiohCardListing } from '../../../../../services/yugioh/types';

type PreviewTradeListingImageProps = {
  listing: YugiohCardListing;
};

function PreviewTradeListingImage(props: PreviewTradeListingImageProps): JSX.Element {
  const image = props.listing.card_in_set.yugioh_card.image;
  const name = props.listing.card_name;
  const rarity = props.listing.card_in_set.rarity.rarity_code;
  const set = props.listing.card_in_set.set.set_code;

  return (
    <Tooltip title={`${name} - ${set} - ${rarity}`}>
      <img src={image} alt="" />
    </Tooltip>
  );
}

export default PreviewTradeListingImage;
