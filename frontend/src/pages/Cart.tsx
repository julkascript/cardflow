import { Button, Divider, IconButton, TextField, Tooltip } from '@mui/material';
import PageHeader from '../components/PageHeader';
import PageSection from '../components/PageSection';
import { ShoppingCartContextProvider, useShoppingCart } from '../context/shoppingCart';
import { useCurrentUser } from '../context/user';
import DeleteIcon from '@mui/icons-material/Delete';
import MarketTable from '../components/marketTable/MarketTable';
import YugiohCardQuantityField from '../components/yugioh/table/market/YugiohCardQuantityField';
import React, { useState } from 'react';
import YugiohCardConditionLabel from '../components/yugioh/YugiohCardConditionLabel';

function ShoppingCart(): JSX.Element {
  const { user } = useCurrentUser();
  const { shoppingCart } = useShoppingCart();
  const price = Number(
    shoppingCart.reduce((totalPrice, item) => totalPrice + item.listing.price, 0).toFixed(2),
  );
  const shipmentCost = 9.55;
  const quantity = shoppingCart.reduce((total, item) => total + item.listing.quantity, 0);
  const sellers = shoppingCart.length;

  const [shipmentAddress, setShipmentAddress] = useState('');
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setShipmentAddress(event.target.value);
  }

  const shipmentAddressIsValid = shipmentAddress !== '';

  return (
    <ShoppingCartContextProvider>
      <PageHeader heading="Shopping cart" />
      <PageSection>
        <section>
          <section>
            <h2>{user.username}</h2>
            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          </section>
          <div>
            <section>
              <h3>Summary</h3>
              <ul>
                <SummaryData summary="Card(s) total price" data={price} />
                <SummaryData summary="Shipment price" data={shipmentCost} />
                <SummaryData boldedData summary="Card(s) total price" data={price + shipmentCost} />
              </ul>
            </section>
            <section>
              <h3>Shipping details</h3>
              <TextField
                error={!shipmentAddressIsValid}
                helperText={shipmentAddressIsValid ? '' : 'Please enter a valid address!'}
                value={shipmentAddress}
                onChange={handleChange}
              />
            </section>
          </div>
          <section>
            <MarketTable>
              <thead>
                <tr>
                  <th colSpan={3}>Card Details</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shoppingCart.map((shoppingCartItem) => (
                  <tr key={shoppingCartItem.listing.id}>
                    <td>{shoppingCartItem.listing.card_name}</td>
                    <td>{shoppingCartItem.set_code}</td>
                    <td>
                      <YugiohCardConditionLabel condition={shoppingCartItem.condition} />
                    </td>
                    <td>
                      <YugiohCardQuantityField
                        hidden={false}
                        onChange={() => {}}
                        quantity={shoppingCartItem.listing.quantity}
                        max={shoppingCartItem.listing.quantity}
                      />
                    </td>
                    <td>
                      <Tooltip title="Remove this listing">
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </MarketTable>
          </section>
        </section>
        <section>
          <div>
            <span>Total:</span>
            <span>${price + shipmentCost}</span>
          </div>
          <Button disabled={!shipmentAddressIsValid} variant="contained" color="success">
            Checkout
          </Button>
          <Divider />
          <ul>
            <CheckoutData summary="Shipping cost" data={shipmentCost} />
            <CheckoutData summary="Items cost" data={price} />
          </ul>
          <Divider />
          <ul>
            <CheckoutData summary="Amount of sellers" data={sellers} />
            <CheckoutData summary="Amount of cards" data={quantity} />
          </ul>
        </section>
      </PageSection>
    </ShoppingCartContextProvider>
  );
}

type SummaryDataProps = {
  data: number;
  summary: string;
  boldedData?: boolean;
};

function SummaryData(props: SummaryDataProps): JSX.Element {
  return (
    <li>
      <div>
        <span>{props.summary}</span>
        <span className={props.boldedData ? 'font-bold' : ''}>{props.data}</span>
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
    <li>
      <span>{props.summary}</span>
      <span>${props.data}</span>
    </li>
  );
}

export default ShoppingCart;
