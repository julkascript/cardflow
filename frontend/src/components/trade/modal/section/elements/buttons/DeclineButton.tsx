import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';
import { TradeModalButtonProps } from './ButtonProps';
import { useTranslation } from 'react-i18next';

function DeclineButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();
  const { t } = useTranslation('trade');

  if (
    !offersAreTheSame(trade, initialTradeOffer) ||
    trade.trade_status !== 'negotiate' ||
    (trade.recipient_listing.length === 0 && !trade.initiator_cash) ||
    (trade.initiator_listing.length === 0 && !trade.recipient_cash)
  ) {
    return <></>;
  }

  return (
    <Button color="error" variant="outlined" onClick={props.onClick}>
      {t('modal.buttons.decline')}
    </Button>
  );
}

export default DeclineButton;
