import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { UserSearchResult } from '../../../services/user/types';
import { Button, Link } from '@mui/material';
import YugiohSellerRankBadge from '../../yugioh/seller/YugiohSellerRankBadge';

type UserSearchResultRowProps = {
  user: UserSearchResult;
};

function UserSearchResultRow(props: UserSearchResultRowProps) {
  return (
    <tr>
      <td>
        <YugiohSellerRankBadge sales={408} />
      </td>
      <td>408</td>
      <td>
        <Link
          sx={{ color: '#0B70E5' }}
          className="font-bold"
          href={`/user/${props.user.username}`}
          underline="hover"
        >
          {props.user.username}
        </Link>
      </td>
      <td>{props.user.listed_listings_count}</td>
      <td>
        <Button
          color="success"
          variant="contained"
          sx={{ color: 'white', ':hover': { color: 'black' } }}
        >
          <SwapHorizIcon />
        </Button>
      </td>
    </tr>
  );
}

export default UserSearchResultRow;
