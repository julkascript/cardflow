import {
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Rating as BaseRating,
  TextField,
  styled,
  Button,
} from '@mui/material';
import { Order, orderState } from '../../services/orders/types';
import OrderStatusBadge from './OrderStatusBadge';
import { useState } from 'react';
import MarketTable from '../marketTable/MarketTable';
import SummaryData from '../shoppingCart/SummaryData';
import Home from '@mui/icons-material/Home';
import { createPortal } from 'react-dom';
import { orderStates } from '../../constants/orders';

const Rating = styled(BaseRating)({
  '& .MuiRating-iconFilled': {
    color: '#fff53d',
  },
  '& .MuiRating-iconHover': {
    color: '#fff53d',
  },
});

type OrdersModalProps = {
  open: boolean;
  onClose: () => void;
  order: Order;
  status: orderState;
  userPosition: 'seller' | 'buyer';
};

function OrdersModal(props: OrdersModalProps): JSX.Element {
  const order = props.order;
  const [receivedOption, setReceivedOption] = useState(props.status);
  const totalPrice = props.order.order_items.reduce(
    (total, order) => total + order.quantity * order.listing.price,
    0,
  );
  const shipmentPrice = 9.85;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setReceivedOption(event.target.value as orderState);
  }

  function save() {}

  return createPortal(
    <Dialog
      className="orders-modal"
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="md"
    >
      <div className="p-16">
        <section className="flex gap-4 items-center mb-6 justify-center lg:justify-start">
          <h2 className="font-bold text-4xl">Order #{order.order_id}</h2>
          <OrderStatusBadge orderState={order.status} />
        </section>
        <div className="mb-4 justify-center flex lg:block">
          <FormControl>
            {props.userPosition === 'buyer' ? (
              <RadioGroup name="status" value={receivedOption} onChange={handleChange}>
                <FormControlLabel
                  disabled={props.status !== 'sent'}
                  control={<Radio color="info" />}
                  label="Received"
                  value="received"
                />
                <FormControlLabel
                  disabled={props.status !== 'sent'}
                  control={<Radio color="info" />}
                  label="Not received"
                  value="not received"
                />
              </RadioGroup>
            ) : (
              <RadioGroup name="status" value={receivedOption} onChange={handleChange}>
                <FormControlLabel control={<Radio color="info" />} label="Sent" value="sent" />
                <FormControlLabel
                  control={<Radio color="info" />}
                  label="Rejected"
                  value="rejected"
                />
              </RadioGroup>
            )}
          </FormControl>
        </div>
        <div className="lg:text-left text-center">
          <Link
            href={`/user/${order.sender_user.username}`}
            sx={{ color: '#0B70E5', fontSize: 20 }}
            underline="hover"
            className="font-bold"
          >
            {order.sender_user.username}
          </Link>
        </div>
        <Divider />
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-row gap-4 py-4">
          <section className="w-2/5">
            <h3 className="font-bold mb-4">Summary</h3>
            <ul className="mr-4">
              <SummaryData summary="Card(s) total price" data={totalPrice} />
              <SummaryData summary="Shipment price" data={shipmentPrice} />
              <SummaryData boldedData summary="Total" data={totalPrice + shipmentPrice} />
            </ul>
          </section>
          <Divider className="hidden lg:block" orientation="vertical" flexItem />
          <Divider className="block lg:hidden" flexItem />
          <div>
            <h3 className="font-bold mb-4">Shipping details</h3>
            <TextField
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
              value={order.delivery_address}
              disabled={true}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex mt-4 mb-8 lg:justify-center w-full overflow-auto">
          <MarketTable className="text-center w-full">
            <thead>
              <tr>
                <th colSpan={2}>Card Details</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((o) => (
                <tr>
                  <td className="font-bold">{o.listing.card_name}</td>
                  <td>{o.listing.card_in_set.set.set_code}</td>
                  <td>{o.quantity}</td>
                  <td className="font-bold">$&nbsp;{o.listing.price * o.quantity}</td>
                </tr>
              ))}
            </tbody>
          </MarketTable>
        </div>
        <div className="flex flex-col items-center gap-4 lg:gap-0 lg:items-start lg:flex-row w-full">
          <section>
            <h3 className="font-bold mb-2 lg:mb-4 text-center lg:text-left">History</h3>
            <ul className="flex flex-col gap-2">
              {props.order.status_history.map((s) => (
                <li>
                  {orderStates[s.status]} - {formatTimestamp(s.timestamp)}
                </li>
              ))}
            </ul>
          </section>
          <Divider className="hidden lg:block lg:px-[86px]" orientation="vertical" flexItem />
          <Divider className="block lg:hidden" flexItem />
          <section className="w-full flex flex-col items-center lg:w-auto lg:block lg:mx-auto">
            <h3 className="font-bold mb-4 lg:mb-2 text-center lg:text-left">Feedback</h3>
            <form className="flex flex-col w-full items-center lg:w-auto lg:items-start">
              <label className="flex items-center gap-2 mb-2">
                <span>Rate:</span> <Rating name="rating" />
              </label>
              <label className="block w-full">
                <div>Comment:</div>
                <TextField fullWidth className="w-full" minRows={3} multiline name="comment" />
              </label>
            </form>
          </section>
        </div>
        <div className="flex justify-between mt-8">
          <Button className="" href="/about/contact" color="error" variant="outlined">
            Report
          </Button>
          <div className="flex gap-4">
            <Button variant="outlined" onClick={props.onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={save}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>,
    document.body,
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('de');
}

export default OrdersModal;
