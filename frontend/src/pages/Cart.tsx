import PageHeader from '../components/PageHeader';
import { useShoppingCart } from '../context/shoppingCart';
import { useCurrentUser } from '../context/user';
import { useEffect, useState } from 'react';
import { useEffectAfterInitialLoad } from '../util/useEffectAfterInitialLoad';
import { BuyYugiohCardListing } from '../services/yugioh/types';
import { yugiohService } from '../services/yugioh/yugiohService';
import { useNavigate } from 'react-router-dom';
import ShoppingCartSummary from '../components/shoppingCart/ShoppingCartSummary';
import ShoppingCartCheckout from '../components/shoppingCart/ShoppingCartCheckout';

function ShoppingCart(): JSX.Element {
  const { user } = useCurrentUser();
  const { shoppingCart, removeListing, removeAll, changeListingQuantity } = useShoppingCart();
  const navigate = useNavigate();

  const [shipmentAddress, setShipmentAddress] = useState('');
  const shipmentCost = shipmentAddress && shoppingCart.length ? 9.55 : 0;

  function checkout() {
    const fetchFunctions = shoppingCart.map((item) => {
      const listing: BuyYugiohCardListing = {
        card: item.listing.card,
        price: item.listing.price,
        condition: item.listing.condition,
        is_listed: item.listing.is_listed,
        is_sold: item.listing.is_sold,
      };

      return yugiohService.buyCardListing(item.listing.id, listing);
    });

    Promise.all(fetchFunctions).then(() => {
      localStorage.removeItem('cart');
      removeAll();
      navigate('/');
    });
  }

  useEffectAfterInitialLoad(() => {
    localStorage.setItem('cart', JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  useEffect(() => {
    if (user.shipping_address) {
      setShipmentAddress(user.shipping_address || '');
    }
  }, [user]);

  return (
    <>
      <PageHeader heading="Shopping cart" />
      <div
        id="summary"
        className="flex flex-col items-center lg:flex-row lg:items-start pb-4 pt-4 justify-center gap-4 bg-[#F5F5F5]"
      >
        <ShoppingCartSummary
          user={user}
          shoppingCart={shoppingCart}
          shipmentCost={shipmentCost}
          shipmentAddress={shipmentAddress}
          onShipmentAddressChange={setShipmentAddress}
          onRemoveAll={removeAll}
          onRemove={removeListing}
          onChangeQuantity={changeListingQuantity}
        />
        <ShoppingCartCheckout
          shoppingCart={shoppingCart}
          onCheckout={checkout}
          shipmentAddress={shipmentAddress}
          shipmentCost={shipmentCost}
        />
      </div>
    </>
  );
}

export default ShoppingCart;
