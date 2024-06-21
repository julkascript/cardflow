import { Button, Divider, Typography } from '@mui/material';
import PageSection from '../PageSection';
import CheckoutData from './CheckoutData';
import { ShoppingCartItem } from '../../services/shoppingCart/types';
import { useTranslation } from 'react-i18next';

type ShoppingCartCheckoutProps = {
  shoppingCart: ShoppingCartItem[];
  onCheckout: () => void;
  shipmentAddress: string;
  shipmentCost: number;
  totalPrice: number;
};

function ShoppingCartCheckout(props: ShoppingCartCheckoutProps) {
  const shipmentAddressIsValid = props.shipmentAddress !== '';
  const quantity = props.shoppingCart.reduce((total, item) => total + item.quantity, 0);
  const sellers = props.shoppingCart.length;
  const { t } = useTranslation('buy');

  return (
    <PageSection className="p-4 w-1/2 lg:w-1/6 h-[600px] lg:sticky top-0">
      <div id="checkout" className="flex justify-center flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between">
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '16pt', margin: 0 }}
            color="text.secondary"
            component="h3"
          >
            {t('cart.checkout.title')}
          </Typography>
          <span className="font-bold text-[16pt]">
            ${(props.totalPrice + props.shipmentCost).toFixed(2)}
          </span>
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
          {t('cart.checkout.checkoutButtonText')}
        </Button>
        <Divider flexItem />
        <ul>
          <CheckoutData summary={t('cart.checkout.shippingCost')} data={props.shipmentCost} />
          <CheckoutData summary={t('cart.checkout.itemsCost')} data={props.totalPrice} />
        </ul>
        <Divider />
        <ul>
          <CheckoutData withDollar summary={t('cart.checkout.amountOfSellers')} data={sellers} />
          <CheckoutData withDollar summary={t('cart.checkout.amountOfCards')} data={quantity} />
        </ul>
      </div>
    </PageSection>
  );
}

export default ShoppingCartCheckout;
