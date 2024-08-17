import { Button, ButtonProps } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';

function DeclineButton(props: ButtonProps): JSX.Element {
  const { trade } = useTrade();

  if (trade.offerHasChanged) {
    return <></>;
  }

  return (
    <Button color="error" variant="outlined" onClick={props.onClick}>
      Decline
    </Button>
  );
}

export default DeclineButton;
