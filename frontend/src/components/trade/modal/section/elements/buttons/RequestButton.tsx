import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';

function RequestButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();

  if (offersAreTheSame(trade, initialTradeOffer) || trade.trade_status !== 'negotiate') {
    return <></>;
  }

  const disabled =
    (trade.initiator_listing.length === 0 && !trade.initiator_cash) ||
    (trade.recipient_listing.length === 0 && !trade.recipient_cash);

  return (
    <Button
      sx={{ color: 'white', ':hover': { color: 'black' } }}
      variant="contained"
      color="success"
      onClick={props.onClick}
      disabled={disabled}
    >
      Request
    </Button>
  );
}

export default RequestButton;
