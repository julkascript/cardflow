import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';

function RequestButton(props: TradeModalButtonProps): JSX.Element {
  const { trade } = useTrade();

  if (!trade.offerHasChanged) {
    return <></>;
  }

  return (
    <Button
      sx={{ color: 'white', ':hover': { color: 'black' } }}
      variant="contained"
      color="success"
      onClick={props.onClick}
    >
      Request
    </Button>
  );
}

export default RequestButton;
