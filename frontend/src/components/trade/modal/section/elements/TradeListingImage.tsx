import { Button, Chip } from '@mui/material';
import { useTrade } from '../../../../../context/trade';
import { TradeParticipant } from '../../../../../services/trade/types';
import { YugiohCardListing } from '../../../../../services/yugioh/types';
import { useTranslation } from 'react-i18next';

type TradeListingImageProps = {
  listing: YugiohCardListing;
  user: TradeParticipant;
};

function TradeListingImage(props: TradeListingImageProps): JSX.Element {
  const { trade, removeInitiatorListingOrCash, removeRecipientListingOrCash } = useTrade();

  const remove =
    trade.recipient.id === props.user.id
      ? removeRecipientListingOrCash
      : removeInitiatorListingOrCash;

  const { t } = useTranslation('trade');

  return (
    <div className="w-[150px] md:w-[245px] flex flex-col gap-4 lg:flex-shrink-0 lg:flex-grow-0 lg:basis-[245px]">
      <img
        className="min-w-full h-[218px] md:h-[356px]"
        src={props.listing.card_in_set.yugioh_card.image}
      />
      <h4 className="font-bold text-center">{props.listing.card_name}</h4>
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between items-center">
        <div className="flex gap-2">
          <Chip
            color="secondary"
            variant="outlined"
            size="small"
            label={props.listing.card_in_set.set.set_code}
          />
          <Chip
            color="secondary"
            variant="outlined"
            size="small"
            label={props.listing.card_in_set.rarity.rarity}
          />
        </div>
        {trade.trade_status === 'negotiate' ? (
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => remove(props.listing)}
          >
            {t('modal.buttons.remove')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default TradeListingImage;
