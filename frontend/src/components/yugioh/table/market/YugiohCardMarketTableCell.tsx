import { Link } from '@mui/material';
import YugiohCardConditionLabel from '../../YugiohCardConditionLabel';
import YugiohSellerRankBadge from '../../seller/YugiohSellerRankBadge';
import YugiohSellerRankLabel from '../../seller/YugiohSellerRankLabel';
import AddToCartButton from './AddToCartButton';
import YugiohCardQuantityField from './YugiohCardQuantityField';
import { YugiohCardListing } from '../../../../services/yugioh/types';
import React, { useState } from 'react';
import { useAuthenticationStatus, useCurrentUser } from '../../../../context/user';
import { shoppingCartService } from '../../../../services/shoppingCart/shoppingCart';
import { useShoppingCart } from '../../../../context/shoppingCart';
import { errorToast } from '../../../../util/errorToast';
import toast from 'react-hot-toast';
import { toastMessages } from '../../../../constants/toast';

type YugiohCardMarketTableCellProps = {
  listing: YugiohCardListing;
};

function YugiohCardMarketTableCell(props: YugiohCardMarketTableCellProps): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const { user } = useCurrentUser();
  const { isAuthenticated } = useAuthenticationStatus();
  const { setShoppingCart } = useShoppingCart();
  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    shoppingCartService
      .addItem({ listing_id: props.listing.id, quantity })
      .then(() => {
        toast.success(
          toastMessages.success.shoppingCartItemAdded(
            props.listing.card_name,
            props.listing.card_in_set.set.set_code,
          ),
        );
        return shoppingCartService.getItems();
      })
      .then((data) => setShoppingCart(data.count))
      .catch(errorToast);
  }

  const cannotBuy = user.user_id === props.listing.user || !isAuthenticated;
  return (
    <tr>
      <td className="hidden lg:table-cell text-center w-16">
        <YugiohSellerRankBadge sales={900} />
      </td>
      <td className="hidden lg:table-cell text-center w-16">
        <YugiohSellerRankLabel sales={900} />
      </td>
      <td className="text-sm lg:text-xl">
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
      <td className="lg:text-center text-sm lg:text-xl p-1">{props.listing.quantity}</td>
      <td className="font-bold text-sm lg:text-xl lg:w-[200px]">$&nbsp;{props.listing.price}</td>
      <td className="w-1">
        <YugiohCardQuantityField
          max={props.listing.quantity}
          quantity={quantity}
          onChange={(v) => setQuantity(v)}
          hidden={cannotBuy || props.listing.quantity === 1}
        />
      </td>
      <td>
        <AddToCartButton hidden={cannotBuy} onClick={handleAddToCart} />
      </td>
    </tr>
  );
}

export default YugiohCardMarketTableCell;
