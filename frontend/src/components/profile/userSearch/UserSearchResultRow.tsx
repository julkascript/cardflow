import { UserSearchResult } from '../../../services/user/types';
import { Link } from '@mui/material';
import YugiohSellerRankBadge from '../../yugioh/seller/YugiohSellerRankBadge';
import UserSearchTradeButton from './UserSearchTradeButton';

type UserSearchResultRowProps = {
  user: UserSearchResult;
};

function UserSearchResultRow(props: UserSearchResultRowProps) {
  return (
    <tr>
      <td className="w-[50px]">
        <YugiohSellerRankBadge sales={408} />
      </td>
      <td className="w-[75px]">
        <div className="border rounded-sm">408</div>
      </td>
      <td className="text-left">
        <Link
          sx={{ color: '#0B70E5' }}
          className="font-bold"
          href={`/user/${props.user.username}`}
          underline="hover"
        >
          {props.user.username}
        </Link>
      </td>
      <td className="w-[300px]">{props.user.listed_listings_count}</td>
      <td className="w-[150px]">
        <UserSearchTradeButton user={props.user} />
      </td>
    </tr>
  );
}

export default UserSearchResultRow;
