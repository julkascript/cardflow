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
          <h2 className="font-bold text-4xl">Order #{order.id}</h2>
          <OrderStatusBadge orderState={order.state} />
        </section>
        <div className="mb-4 justify-center flex lg:block">
          <FormControl>
            {props.userPosition === 'seller' ? (
              <RadioGroup name="status" value={receivedOption} onChange={handleChange}>
                <FormControlLabel
                  control={<Radio color="info" />}
                  label="Received"
                  value="received"
                />
                <FormControlLabel
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
        {/* TO-DO: update URL */}
        <div className="lg:text-left text-center">
          <Link sx={{ color: '#0B70E5', fontSize: 20 }} underline="hover" className="font-bold">
            Kadabra
          </Link>
        </div>
        <Divider />
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-row gap-4 py-4">
          <section className="w-2/5">
            <h3 className="font-bold mb-4">Summary</h3>
            <ul className="mr-4">
              <SummaryData summary="Card(s) total price" data={150} />
              <SummaryData summary="Shipment price" data={9.85} />
              <SummaryData boldedData summary="Total" data={150 + 9.85} />
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
              value="Lavender Town"
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
              <tr>
                <td className="font-bold">Dark Magical Circle</td>
                <td>CT12</td>
                <td>1</td>
                <td className="font-bold">$&nbsp;0.03</td>
              </tr>
            </tbody>
          </MarketTable>
        </div>
        <div className="flex flex-col items-center gap-4 lg:gap-0 lg:items-start lg:flex-row w-full">
          <section>
            <h3 className="font-bold mb-2 lg:mb-4 text-center lg:text-left">History</h3>
            <ul className="flex flex-col gap-2">
              <li>State 1 - 20.11.2024</li>
              <li>State 2 - 20.11.2024</li>
              <li>State 3 - 20.11.2024</li>
              <li>State 4 - 20.11.2024</li>
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

export default OrdersModal;
