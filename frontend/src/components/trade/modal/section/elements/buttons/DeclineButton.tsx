import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';
import { TradeModalButtonProps } from './ButtonProps';

function DeclineButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();

  if (!offersAreTheSame(trade, initialTradeOffer) || trade.trade_status !== 'negotiate') {
    return <></>;
  }

  return (
    <Button
      disabled={props.otherUserDecision === 'pending'}
      color="error"
      variant="outlined"
      onClick={props.onClick}
    >
      Decline
    </Button>
  );
}

export default DeclineButton;
