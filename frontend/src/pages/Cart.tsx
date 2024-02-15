import { useCurrentUser } from '../context/user';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartSummary from '../components/shoppingCart/ShoppingCartSummary';
import ShoppingCartCheckout from '../components/shoppingCart/ShoppingCartCheckout';
import { ShoppingCartItem } from '../services/shoppingCart/types';
import { shoppingCartService } from '../services/shoppingCart/shoppingCart';
import { PaginatedItem } from '../services/yugioh/types';
import { useShoppingCart } from '../context/shoppingCart';
import { useEffectAfterInitialLoad } from '../util/useEffectAfterInitialLoad';
import { errorToast } from '../util/errorToast';
import toast from 'react-hot-toast';
import { toastMessages } from '../constants/toast';
import BreadcrumbNavigation, { BreadcrumbLink } from '../components/BreadcrumbNavigation';

function ShoppingCart(): JSX.Element {
  const { user } = useCurrentUser();
  const [shoppingCart, setCart] = useState<ShoppingCartItem[]>([]);
  const { setShoppingCart } = useShoppingCart();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(0);

  const [shipmentAddress, setShipmentAddress] = useState('');
  const shipmentCost = shipmentAddress && shoppingCart.length ? 9.55 : 0;
  const [totalPrice, setTotalPrice] = useState(0);

  function checkout() {
    shoppingCartService
      .checkout({ delivery_address: shipmentAddress })
      .then(() => {
        navigate('/');
        setShoppingCart(0);
        toast.success(toastMessages.success.checkout);
      })
      .catch(errorToast); // TO-DO: add toasts when this is merged
  }

  function removeListing(id: number) {
    shoppingCartService
      .deleteItem(id)
      .then(() => {
        if (shoppingCart.length - 1 === 0) {
          setPage(page - 1 || 1);
        }
        toast.success(toastMessages.success.shoppingCartItemDeleted);
        return shoppingCartService.getItems(undefined, page);
      })
      .then((data) => {
        loadShoppingCart(data);
      })
      .catch(errorToast);
  }

  function removeAll() {
    const fetchFunctions = shoppingCart.map((item) => shoppingCartService.deleteItem(item.id));
    Promise.all(fetchFunctions).then(() => {
      setItems(0);
      setCart([]);
      setPage(1);
      setTotalPrice(0);
      toast.success(toastMessages.success.shoppingCartEmptiedOut);
    });
  }

  function changeListingQuantity(id: number, quantity: number) {
    shoppingCartService
      .addItem({ listing_id: id, quantity })
      .then(() => shoppingCartService.getItems(undefined, page))
      .then(loadShoppingCart)
      .catch((err) => errorToast(err, toastMessages.error.failedShoppingCartQuantityUpdate));
  }

  function loadShoppingCart(data: PaginatedItem<ShoppingCartItem>) {
    setCart(data.results);
    setItems(data.count);
    setShoppingCart(data.count);
    setTotalPrice(data.results.reduce((total, item) => total + item.total_price, 0));
  }

  useEffect(() => {
    if (user.shipping_address) {
      setShipmentAddress(user.shipping_address || '');
    }

    if (user.user_id) {
      shoppingCartService.getItems(undefined, page).then(loadShoppingCart).catch(errorToast);
    }
  }, [user]);

  useEffectAfterInitialLoad(() => {
    shoppingCartService.getItems(undefined, page).then(loadShoppingCart).catch(errorToast);
  }, [page]);

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/search',
      text: 'Buy',
    },
  ];

  return (
    <>
      <BreadcrumbNavigation links={breadcrumbNavigation} heading="Checkout" />
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
          page={page}
          pages={Math.ceil(items / 10)}
          onChangePage={setPage}
          totalPrice={totalPrice}
        />
        <ShoppingCartCheckout
          shoppingCart={shoppingCart}
          onCheckout={checkout}
          shipmentAddress={shipmentAddress}
          shipmentCost={shipmentCost}
          totalPrice={totalPrice}
        />
      </div>
    </>
  );
}

export default ShoppingCart;
