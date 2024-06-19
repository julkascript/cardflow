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
import { legacyErrorToast } from '../util/errorToast';
import { toastMessages } from '../constants/toast';
import BreadcrumbNavigation, { BreadcrumbLink } from '../components/BreadcrumbNavigation';
import { useToast } from '../util/useToast';

function ShoppingCart(): JSX.Element {
  const { user } = useCurrentUser();
  const [shoppingCart, setCart] = useState<ShoppingCartItem[]>([]);
  const { setShoppingCart } = useShoppingCart();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(0);
  const toast = useToast();

  const [shipmentAddress, setShipmentAddress] = useState('');
  const shipmentCost = shipmentAddress && shoppingCart.length ? 9.55 : 0;
  const [totalPrice, setTotalPrice] = useState(0);

  function checkout() {
    shoppingCartService
      .checkout({ delivery_address: shipmentAddress })
      .then(() => {
        navigate('/');
        setShoppingCart(0);
        toast.success({ toastKey: toastMessages.checkout });
      })
      .catch((error) => toast.error({ error }));
  }

  function removeListing(id: number) {
    shoppingCartService
      .deleteItem(id)
      .then(() => {
        const newPage = page - 1 || 1;
        if (shoppingCart.length - 1 === 0) {
          setPage(newPage);
        }

        toast.success({ toastKey: toastMessages.shoppingCartItemDeleted });
        return shoppingCartService.getItems(undefined, newPage);
      })
      .then((data) => {
        loadShoppingCart(data);
      })
      .catch((error) => toast.error({ error }));
  }

  function removeAll() {
    const fetchFunctions = shoppingCart.map((item) => shoppingCartService.deleteItem(item.id));
    Promise.all(fetchFunctions).then(() => {
      setItems(0);
      setCart([]);
      setPage(1);
      setTotalPrice(0);
      toast.success({ toastKey: toastMessages.shoppingCartEmptiedOut });
    });
  }

  function changeListingQuantity(id: number, quantity: number) {
    shoppingCartService
      .addItem({ listing_id: id, quantity })
      .then(() => shoppingCartService.getItems(undefined, page))
      .then(loadShoppingCart)
      .catch((error) =>
        toast.error({
          error,
          toastKey: toastMessages.failedShoppingCartQuantityUpdate,
        }),
      );
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
      shoppingCartService.getItems(undefined, page).then(loadShoppingCart).catch(legacyErrorToast);
    }
  }, [user]);

  useEffectAfterInitialLoad(() => {
    shoppingCartService.getItems(undefined, page).then(loadShoppingCart).catch(legacyErrorToast);
  }, [page]);

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/buy',
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
          count={items}
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
