import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';

function AcceptButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();

  if (!offersAreTheSame(trade, initialTradeOffer) || trade.trade_status !== 'negotiate') {
    return <></>;
  }

  return (
    <Button
      sx={{ color: 'white', ':hover': { color: 'black' } }}
      variant="contained"
      color="success"
      onClick={props.onClick}
      disabled={props.otherUserDecision === 'pending'}
    >
      Accept
    </Button>
  );
}

export default AcceptButton;
