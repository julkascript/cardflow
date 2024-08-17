import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';

function RequestButton(props: TradeModalButtonProps): JSX.Element {
  const { trade } = useTrade();

  if (trade.trade_status !== 'negotiate') {
    return <></>;
  }

  const disabled =
    (!trade.initiator_cash && trade.initiator_listing.length === 0) ||
    (!trade.recipient_cash && trade.recipient_listing.length === 0);

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
