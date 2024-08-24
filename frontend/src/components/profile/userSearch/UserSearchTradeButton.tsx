import { Button } from '@mui/material';
import { useCurrentUser } from '../../../context/user';
import { UserSearchResult } from '../../../services/user/types';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { tradeService } from '../../../services/trade/trade';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../util/useToast';

type UserSearchTradeButtonProps = {
  user: UserSearchResult;
};

function UserSearchTradeButton(props: UserSearchTradeButtonProps): JSX.Element {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const toast = useToast();

  if (user.user_id === props.user.id) {
    return <></>;
  }

  function initiateTrade() {
    tradeService
      .initiate(user.user_id, props.user.id)
      .then((trade) => navigate(`/trade/${trade.id}`))
      .catch(toast.error);
  }

  return (
    <Button
      color="success"
      variant="contained"
      onClick={initiateTrade}
      sx={{ color: 'white', ':hover': { color: 'black' } }}
    >
      <SwapHorizIcon />
    </Button>
  );
}

export default UserSearchTradeButton;
