import { Button, ButtonProps } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { useCurrentUser } from '../../../../../../context/user';

function DeclineButton(props: ButtonProps): JSX.Element {
  const { trade } = useTrade();
  const { user } = useCurrentUser();

  if (trade.trade_status !== 'negotiate') {
    return <></>;
  }

  if (
    (user.user_id === trade.initiator.id && trade.initiator_decision === 'pending') ||
    (user.user_id === trade.recipient.id && trade.recipient_decision === 'pending')
  ) {
    return (
      <Button color="error" variant="outlined" onClick={props.onClick}>
        Decline
      </Button>
    );
  }

  return <></>;
}

export default DeclineButton;
