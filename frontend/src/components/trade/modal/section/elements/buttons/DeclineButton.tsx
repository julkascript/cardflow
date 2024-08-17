import { Button, ButtonProps } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';

function DeclineButton(props: ButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();

  if (!offersAreTheSame(trade, initialTradeOffer)) {
    return <></>;
  }

  return (
    <Button color="error" variant="outlined" onClick={props.onClick}>
      Decline
    </Button>
  );
}

export default DeclineButton;
