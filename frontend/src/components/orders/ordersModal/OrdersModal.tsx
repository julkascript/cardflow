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
import { Order, orderState } from '../../../services/orders/types';
import OrderStatusBadge from '../OrderStatusBadge';
import { useEffect, useState } from 'react';
import MarketTable from '../../marketTable/MarketTable';
import SummaryData from '../../shoppingCart/SummaryData';
import Home from '@mui/icons-material/Home';
import { createPortal } from 'react-dom';
import { orderService } from '../../../services/orders/orderService';
import { toastMessages } from '../../../constants/toast';
import { Feedback } from '../../../services/feedback/types';
import { feedbackService } from '../../../services/feedback/feedback';
import { useToast } from '../../../util/useToast';
import { useTranslation } from 'react-i18next';

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
  /**
   *
   * @param closedFromAction if the modal was closed due to the user successfully
   * performing some action (e.g. changing the status).
   * @returns
   */
  onClose: (closedFromAction?: boolean) => void;
  order: Order;
  status: orderState;
  userPosition: 'seller' | 'buyer';
  feedback: Feedback | undefined;
};

function OrdersModal(props: OrdersModalProps): JSX.Element {
  const order = props.order;
  const [receivedOption, setReceivedOption] = useState(props.status);
  const toast = useToast();
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const totalPrice = props.order.order_items.reduce(
    (total, order) => total + order.quantity * order.listing.price,
    0,
  );
  const shipmentPrice = 9.85;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const cannotGiveFeedback =
    props.feedback !== undefined ||
    props.userPosition === 'seller' ||
    hasSubmitted ||
    (props.status !== 'completed' &&
      props.status !== 'rejected' &&
      props.status !== 'not_sent' &&
      props.status !== 'not_received');

  const userToDisplay =
    props.userPosition === 'seller' ? props.order.receiver_user : props.order.sender_user;

  const [rating, setRating] = useState(props.feedback?.rating || 0);
  const saveButtonIsDisabled =
    props.status === receivedOption && (cannotGiveFeedback || rating === 0);

  const [comment, setComment] = useState(props.feedback?.comment || '');

  function handleCommentChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setComment(event.target.value);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setReceivedOption(event.target.value as orderState);
  }

  function changeRating(event: React.SyntheticEvent<Element, Event>, value: number | null) {
    event.preventDefault();
    setRating(value || 0);
  }

  function save() {
    const hasChangedOption = props.status !== receivedOption;
    if (hasChangedOption) {
      orderService
        .changeOrderStatus(order.order_id, receivedOption)
        .then(() => {
          toast.success({
            toastKey: toastMessages.orderStatusChanged,
            context: receivedOption,
            values: {
              orderId: order.order_id,
            },
          });
          props.onClose(true);
        })
        .catch((error) => toast.error({ error }));
    }

    if (rating && !cannotGiveFeedback) {
      feedbackService
        .sendFeedback({
          related_order: order.order_id,
          rating,
          comment,
        })
        .then(() => {
          setHasSubmitted(true);
          if (!hasChangedOption) {
            toast.success({
              toastKey: toastMessages.feedbackGiven,
              values: { orderId: order.order_id },
            });
            props.onClose(true);
          }
        });
    }
  }

  useEffect(() => {
    if (props.feedback) {
      setRating(props.feedback.rating);
    }
  }, [props.feedback]);

  return createPortal(
    <Dialog
      className="orders-modal"
      open={props.open}
      onClose={() => props.onClose()}
      fullWidth
      maxWidth="md"
    >
      <div className="p-16">
        <section className="flex gap-4 items-center mb-6 justify-center lg:justify-start">
          <h2 className="font-bold text-4xl">
            {t('salesAndOrders.modal.title')} #{order.order_id}
          </h2>
          <OrderStatusBadge orderState={order.status} />
        </section>
        <div className="mb-4 justify-center flex lg:block">
          <FormControl>
            {props.userPosition === 'buyer' ? (
              <RadioGroup name="status" value={receivedOption} onChange={handleChange}>
                <FormControlLabel
                  disabled={props.status !== 'sent'}
                  control={<Radio color="info" />}
                  label={t('salesAndOrders.status.completed')}
                  value="completed"
                />
                <FormControlLabel
                  disabled={props.status !== 'sent'}
                  control={<Radio color="info" />}
                  label={t('salesAndOrders.status.not_received')}
                  value="not_received"
                />
              </RadioGroup>
            ) : (
              <RadioGroup name="status" value={receivedOption} onChange={handleChange}>
                <FormControlLabel
                  disabled={
                    props.status === 'completed' ||
                    props.status === 'rejected' ||
                    props.status === 'not_received' ||
                    props.status === 'not_sent'
                  }
                  control={<Radio color="info" />}
                  label={t('salesAndOrders.status.sent')}
                  value="sent"
                />
                <FormControlLabel
                  disabled={
                    props.status === 'completed' ||
                    props.status === 'rejected' ||
                    props.status === 'not_received' ||
                    props.status === 'not_sent'
                  }
                  control={<Radio color="info" />}
                  label={t('salesAndOrders.status.rejected')}
                  value="rejected"
                />
              </RadioGroup>
            )}
          </FormControl>
        </div>
        <div className="lg:text-left text-center">
          <Link
            href={`/user/${userToDisplay.username}`}
            sx={{ color: '#0B70E5', fontSize: 20 }}
            underline="hover"
            className="font-bold"
          >
            {userToDisplay.username}
          </Link>
        </div>
        <Divider />
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-row gap-4 py-4">
          <section className="w-2/5">
            <h3 className="font-bold mb-4">{commonT('purchaseDetails.summary')}</h3>
            <ul className="mr-4">
              <SummaryData
                summary={commonT('purchaseDetails.cardsTotalPrice', {
                  count: props.order.order_items.reduce((total, o) => total + o.quantity, 0),
                })}
                data={totalPrice}
              />
              <SummaryData
                summary={commonT('purchaseDetails.shipmentPrice')}
                data={shipmentPrice}
              />
              <SummaryData
                boldedData
                summary={commonT('purchaseDetails.totalPrice')}
                data={totalPrice + shipmentPrice}
              />
            </ul>
          </section>
          <Divider className="hidden lg:block" orientation="vertical" flexItem />
          <Divider className="block lg:hidden" flexItem />
          <div>
            <h3 className="font-bold mb-4">{commonT('purchaseDetails.shippingDetails.title')}</h3>
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
                <th colSpan={2}>{commonT('purchaseDetails.table.tableHeaders.cardDetails')}</th>
                <th>{commonT('purchaseDetails.table.tableHeaders.quantity')}</th>
                <th>{commonT('purchaseDetails.table.tableHeaders.price')}</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((o) => (
                <tr key={o.listing.id}>
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
            <h3 className="font-bold mb-2 lg:mb-4 text-center lg:text-left">
              {t('salesAndOrders.modal.history.title')}
            </h3>
            <ul className="flex flex-col gap-2">
              {props.order.status_history.map((s) => (
                <li key={s.timestamp + s.status}>
                  {t('salesAndOrders.status.' + s.status)} - {formatTimestamp(s.timestamp)}
                </li>
              ))}
            </ul>
          </section>
          <Divider className="hidden lg:block lg:px-[81px]" orientation="vertical" flexItem />
          <Divider className="block lg:hidden" flexItem />
          <section className="w-full flex flex-col items-center lg:w-auto lg:block lg:mx-auto">
            <h3 className="font-bold mb-4 lg:mb-2 text-center lg:text-left">
              {t('salesAndOrders.modal.feedback.title')}
            </h3>
            <form className="flex flex-col w-full items-center lg:w-auto lg:items-start">
              <label
                id="rating"
                data-disabled={cannotGiveFeedback}
                className="flex items-center gap-2 mb-2"
              >
                <span>{t('salesAndOrders.modal.feedback.rate')}</span>{' '}
                <Rating
                  onChange={changeRating}
                  disabled={cannotGiveFeedback}
                  value={rating}
                  name="rating"
                />
              </label>
              <label className="block w-full">
                <div>{t('salesAndOrders.modal.feedback.comment')}</div>
                <TextField
                  value={props.feedback ? props.feedback.comment : comment}
                  fullWidth
                  className="w-full"
                  minRows={3}
                  multiline
                  name="comment"
                  disabled={cannotGiveFeedback}
                  onChange={handleCommentChange}
                />
              </label>
            </form>
          </section>
        </div>
        <div className="flex justify-between mt-8">
          <Button className="" href="/about/contact" color="error" variant="outlined">
            {t('salesAndOrders.modal.reportButtonText')}
          </Button>
          <div className="flex gap-4">
            <Button variant="outlined" onClick={() => props.onClose()}>
              {t('salesAndOrders.modal.cancelButtonText')}
            </Button>
            <Button
              disabled={saveButtonIsDisabled}
              variant="contained"
              color="success"
              onClick={save}
            >
              {t('salesAndOrders.modal.saveButtonText')}
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
