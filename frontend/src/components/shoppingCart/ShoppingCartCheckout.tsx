import { Button, Divider, Typography } from '@mui/material';
import { ShoppingCardListing } from '../../services/yugioh/types';
import PageSection from '../PageSection';
import CheckoutData from './CheckoutData';

type ShoppingCartCheckoutProps = {
  shoppingCart: ShoppingCardListing[];
  onCheckout: () => void;
  shipmentAddress: string;
  shipmentCost: number;
};

function ShoppingCartCheckout(props: ShoppingCartCheckoutProps) {
  const price = Number(
    props.shoppingCart
      .reduce((totalPrice, item) => totalPrice + item.listing.price * item.boughtQuantity, 0)
      .toFixed(2),
  );

  const shipmentAddressIsValid = props.shipmentAddress !== '';
  const quantity = props.shoppingCart.reduce((total, item) => total + item.boughtQuantity, 0);
  const sellers = props.shoppingCart.length;
  return (
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
          <span className="font-bold text-[16pt]">${(price + props.shipmentCost).toFixed(2)}</span>
        </div>
        <Button
          disabled={!shipmentAddressIsValid || props.shoppingCart.length === 0}
          variant="contained"
          color="success"
          onClick={(e) => {
            e.preventDefault();
            props.onCheckout();
          }}
        >
          Checkout
        </Button>
        <Divider flexItem />
        <ul>
          <CheckoutData summary="Shipping cost" data={props.shipmentCost} />
          <CheckoutData summary="Items cost" data={price} />
        </ul>
        <Divider />
        <ul>
          <CheckoutData withDollar summary="Amount of sellers" data={sellers} />
          <CheckoutData withDollar summary="Amount of cards" data={quantity} />
        </ul>
        <p className="block lg:hidden">
          <a className="text-gray-700 hover:underline font-bold" href="#summary">
            Back to summary
          </a>
        </p>
      </div>
    </PageSection>
  );
}

export default ShoppingCartCheckout;
