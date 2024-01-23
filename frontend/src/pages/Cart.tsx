import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import PageSection from '../components/PageSection';
import { useShoppingCart } from '../context/shoppingCart';
import { useCurrentUser } from '../context/user';
import DeleteIcon from '@mui/icons-material/Delete';
import MarketTable from '../components/marketTable/MarketTable';
import YugiohCardQuantityField from '../components/yugioh/table/market/YugiohCardQuantityField';
import React, { useEffect, useState } from 'react';
import { useEffectAfterInitialLoad } from '../util/useEffectAfterInitialLoad';
import { Home, Info } from '@mui/icons-material';
function ShoppingCart(): JSX.Element {
  const { user } = useCurrentUser();
  const { shoppingCart, removeListing, removeAll, changeListingQuantity } = useShoppingCart();
  const price = Number(
    shoppingCart
      .reduce((totalPrice, item) => totalPrice + item.listing.price * item.boughtQuantity, 0)
      .toFixed(2),
  );

  const quantity = shoppingCart.reduce((total, item) => total + item.boughtQuantity, 0);
  const sellers = shoppingCart.length;

  const [shipmentAddress, setShipmentAddress] = useState('');

  const shipmentCost = shipmentAddress && shoppingCart.length ? 9.55 : 0;
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setShipmentAddress(event.target.value);
  }

  const shipmentAddressIsValid = shipmentAddress !== '';

  const shipmentAddressTooltipText = user.shipping_address
    ? 'Your details were pre-filled from your profile.'
    : 'You can set a default shipment address from your profile, which will be pre-filled for future purchases.';

  function deleteListing(event: React.MouseEvent, id: number) {
    event.preventDefault();
    removeListing(id);
  }

  function deleteAllListings(event: React.MouseEvent) {
    event.preventDefault();
    removeAll();
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
        <PageSection className="p-8 pt-4 w-11/12 lg:w-1/2">
          <section className="flex items-end justify-between flex-wrap border-b-2 border-b-[#D9D9D9]">
            <h2 className="m-0 p-0 font-bold text-xl">
              <Link
                sx={{
                  color: '#0B70E5',
                  textDecoration: 'none',
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
                href={`/user/${user.username}`}
              >
                {user.username}
              </Link>
            </h2>
            <Tooltip title="Empty out the shopping cart (remove all listings)">
              <IconButton onClick={deleteAllListings}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </section>
          <div className="flex flex-wrap flex-col items-center lg:items-start text-center lg:text-left lg:flex-row gap-4 pt-4 pb-4">
            <section className="w-2/5">
              <h3 className="font-bold mb-4">Summary</h3>
              <ul className="mr-4">
                <SummaryData summary="Card(s) total price" data={price} />
                <SummaryData summary="Shipment price" data={shipmentCost} />
                <SummaryData boldedData summary="Total" data={price + shipmentCost} />
              </ul>
            </section>
            <Divider className="none lg:block" orientation="vertical" flexItem />
            <Divider className="block lg:none" flexItem />
            <section>
              <h3 className="font-bold mb-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span>Shipping details</span>
                  <Tooltip title={shipmentAddressTooltipText} placement="top">
                    <IconButton>
                      <Info />
                    </IconButton>
                  </Tooltip>
                </div>
              </h3>
              <TextField
                error={!shipmentAddressIsValid}
                helperText={shipmentAddressIsValid ? '' : 'Please enter a valid address!'}
                value={shipmentAddress}
                onChange={handleChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
                disabled={shoppingCart.length === 0}
                className="w-full"
              />
            </section>
          </div>
          <p className="block lg:hidden text-center">
            <a className="text-gray-700 hover:underline font-bold" href="#checkout">
              Go to checkout
            </a>
          </p>
          <section className="flex mt-4 lg:justify-center w-full overflow-auto">
            <MarketTable className="text-center w-full">
              <thead>
                <tr>
                  <th colSpan={3}>Card Details</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Quantity</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Price</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shoppingCart.map((shoppingCartItem) => (
                  <tr key={shoppingCartItem.listing.id}>
                    <td className="font-bold">{shoppingCartItem.listing.card_name}</td>
                    <td>{shoppingCartItem.set_code}</td>
                    <td>{shoppingCartItem.rarity}</td>
                    <td>
                      <YugiohCardQuantityField
                        hidden={false}
                        onChange={(quantity) =>
                          changeListingQuantity(shoppingCartItem.listing.id, quantity)
                        }
                        quantity={shoppingCartItem.boughtQuantity}
                        max={shoppingCartItem.listing.quantity}
                      />
                    </td>
                    <td className="font-bold">
                      $&nbsp;{shoppingCartItem.listing.price.toFixed(2)}
                    </td>
                    <td>
                      <Tooltip title="Remove this listing">
                        <IconButton onClick={(e) => deleteListing(e, shoppingCartItem.listing.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MarketTable>
          </section>
        </PageSection>
        <PageSection className="p-4 w-1/2 lg:w-1/6 h-[600px] lg:sticky top-0">
          <div id="checkout" className="flex justify-center flex-col gap-4">
            <div className="flex flex-col lg:flex-row items-center lg:justify-between">
              <Typography
                sx={{ fontWeight: 'bold', fontSize: '16pt', margin: 0 }}
                color="text.secondary"
                component="h3"
              >
                Total:
              </Typography>
              <span className="font-bold text-[16pt]">${(price + shipmentCost).toFixed(2)}</span>
            </div>
            <Button
              disabled={!shipmentAddressIsValid || shoppingCart.length === 0}
              variant="contained"
              color="success"
            >
              Checkout
            </Button>
            <Divider flexItem />
            <ul>
              <CheckoutData summary="Shipping cost" data={shipmentCost} />
              <CheckoutData summary="Items cost" data={price} />
            </ul>
            <Divider />
            <ul>
              <CheckoutData summary="Amount of sellers" data={sellers} />
              <CheckoutData summary="Amount of cards" data={quantity} />
            </ul>
            <p className="block lg:hidden">
              <a className="text-gray-700 hover:underline font-bold" href="#summary">
                Back to summary
              </a>
            </p>
          </div>
        </PageSection>
      </div>
    </>
  );
}

type SummaryDataProps = {
  data: number;
  summary: string;
  boldedData?: boolean;
};

function SummaryData(props: SummaryDataProps): JSX.Element {
  return (
    <li className="mb-2">
      <div className="flex justify-between">
        <span>{props.summary}</span>
        <span className={props.boldedData ? 'font-bold' : ''}>${props.data.toFixed(2)}</span>
      </div>
    </li>
  );
}

type CheckoutDataProps = {
  data: number;
  summary: string;
};

function CheckoutData(props: CheckoutDataProps): JSX.Element {
  return (
    <li className="flex justify-between gap-4">
      <Typography color="text.secondary" component="span">
        {props.summary}
      </Typography>
      <Typography color="text.secondary" component="span">
        ${props.data.toFixed(2)}
      </Typography>
    </li>
  );
}

export default ShoppingCart;
