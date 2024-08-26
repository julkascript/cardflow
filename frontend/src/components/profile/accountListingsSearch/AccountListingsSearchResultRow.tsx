import { Tooltip } from '@mui/material';
import { YugiohCardListing } from '../../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SyncIcon from '@mui/icons-material/Sync';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import { useCurrency } from '../../../util/useCurrency';
import YugiohCardQuantityField from '../../yugioh/table/market/YugiohCardQuantityField';
import { useCurrentUser } from '../../../context/user';
import { useState } from 'react';
import AddToCardButton from '../../yugioh/table/market/AddToCartButton';
import { useShoppingCart } from '../../../context/shoppingCart';
import { shoppingCartService } from '../../../services/shoppingCart/shoppingCart';
import { toastMessages } from '../../../constants/toast';
import { useToast } from '../../../util/useToast';

type AccountListingsSearchResultRowProps = {
  listing: YugiohCardListing;
};

function AccountListingsSearchResultRow(props: AccountListingsSearchResultRowProps): JSX.Element {
  const price = useCurrency(props.listing.price);
  const { user } = useCurrentUser();
  const [quantity, setQuantity] = useState(1);
  const { setShoppingCart } = useShoppingCart();
  const toast = useToast();

  function handleCartClick() {
    shoppingCartService
      .addItem({ listing_id: props.listing.id, quantity })
      .then(() => {
        toast.success({
          toastKey: toastMessages.shoppingCartItemAdded,
          values: {
            name: props.listing.card_name,
            setCode: props.listing.card_in_set.set.set_code,
          },
        });
        return shoppingCartService.getItems();
      })
      .then((data) => setShoppingCart(data.count))
      .catch(toast.error);
  }

  return (
    <tr>
      <td>
        <Tooltip
          title={<TooltipImage imageUrl={props.listing.card_in_set.yugioh_card.image} />}
          placement="left-start"
        >
          <CameraAltIcon />
        </Tooltip>
      </td>
      <td>{props.listing.is_trade_considered ? <SyncIcon /> : <SyncDisabledIcon />}</td>
      <td>{props.listing.card_in_set.set.set_code}</td>
      <td>{props.listing.card_name}</td>
      <td>{props.listing.card_in_set.rarity.rarity_code}</td>
      <td>{props.listing.quantity}</td>
      <td>{price}</td>
      <td>
        <YugiohCardQuantityField
          onChange={(q) => setQuantity(q)}
          max={props.listing.quantity}
          quantity={quantity}
          hidden={user.user_id === props.listing.user || !user.user_id}
        />
      </td>
      <td>
        <AddToCardButton
          onClick={handleCartClick}
          hidden={user.user_id === props.listing.user || !user.user_id}
        />
      </td>
    </tr>
  );
}

export default AccountListingsSearchResultRow;

type TooltipImageProps = {
  imageUrl: string;
};

function TooltipImage(props: TooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="" />;
}
