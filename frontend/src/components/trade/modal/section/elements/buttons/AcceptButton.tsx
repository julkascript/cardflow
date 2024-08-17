import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';

function AcceptButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();

  if (!offersAreTheSame(trade, initialTradeOffer)) {
    return <></>;
  }

  return (
    <Button
      sx={{ color: 'white', ':hover': { color: 'black' } }}
      variant="contained"
      color="success"
      onClick={props.onClick}
    >
      Accept
    </Button>
  );
}

export default AcceptButton;
