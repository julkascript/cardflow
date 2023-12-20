import { Link } from '@mui/material';
import YugiohCardConditionLabel from '../../YugiohCardConditionLabel';
import YugiohSellerRankBadge from '../../seller/YugiohSellerRankBadge';
import YugiohSellerRankLabel from '../../seller/YugiohSellerRankLabel';
import AddToCartButton from './AddToCartButton';
import YugiohCardQuantityField from './YugiohCardQuantityField';
import { YugiohCardListing } from '../../../../services/yugioh/types';

type YugiohCardMarketTableCellProps = {
  listing: YugiohCardListing;
};

function YugiohCardMarketTableCell(props: YugiohCardMarketTableCellProps): JSX.Element {
  return (
    <tr>
      <td className="text-center w-16">
        <YugiohSellerRankBadge sales={900} />
      </td>
      <td className="text-center w-16">
        <YugiohSellerRankLabel sales={900} />
      </td>
      <td className="text-xl">
        <Link
          sx={{ color: '#0B70E5' }}
          className="font-bold"
          href={`/user/${props.listing.user_name}`}
          underline="hover"
        >
          {props.listing.user_name}
        </Link>
      </td>
      <td className="w-[50px]">
        <YugiohCardConditionLabel className="w-[110px]" condition={props.listing.condition} />
      </td>
      <td className="text-center">
        <img
          className="min-w-[40px] max-w-[40px] min-h-[20px] max-h-[20px] rounded-md inline-block"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1920px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
        />
        <br />
      </td>
      <td className="text-center text-xl p-1">{props.listing.quantity}</td>
      <td className="font-bold text-xl w-[200px]">$&nbsp;{props.listing.price}</td>
      <td className="w-1">
        <YugiohCardQuantityField quantity={props.listing.quantity} />
      </td>
      <td>
        <AddToCartButton />
      </td>
    </tr>
  );
}

export default YugiohCardMarketTableCell;
