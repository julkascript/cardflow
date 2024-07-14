import {
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Rating as BaseRating,
  TextField,
  styled,
  Button,
} from '@mui/material';
import { Order, orderState } from '../../../services/orders/types';
import { useEffect, useState } from 'react';
import SummaryData from '../../shoppingCart/SummaryData';
import Home from '@mui/icons-material/Home';
import { createPortal } from 'react-dom';
import { orderService } from '../../../services/orders/orderService';
import { toastMessages } from '../../../constants/toast';
import { Feedback } from '../../../services/feedback/types';
import { feedbackService } from '../../../services/feedback/feedback';
import { useToast } from '../../../util/useToast';
import { useTranslation } from 'react-i18next';
import OrdersModalHeader from './layout/OrdersModalHeader';
import OrdersModalPurchases from './layout/OrderModalPurchases';
import OrdersModalUsernameLink from './layout/OrdersModalUsernameLink';

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
  today: Date;
};

function OrdersModal(props: OrdersModalProps): JSX.Element {
  const order = props.order;
  const [receivedOption, setReceivedOption] = useState(props.status);
  const toast = useToast();
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const orderDate = new Date(
    props.order.status_history[props.order.status_history.length - 1].timestamp,
  );

  const timeDifference = props.today.getTime() - orderDate.getTime();

  const tenDaysHavePassed = timeDifference / (1000 * 60 * 60 * 24) > 10;

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
        <OrdersModalHeader order={order} />
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
                  disabled={props.status !== 'sent' || !tenDaysHavePassed}
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
        <Divider />
        <OrdersModalPurchases order={order} />
        <OrdersModalUsernameLink order={order} userPosition={props.userPosition} />
        <div className="flex flex-col text-center gap-y-4 lg:text-left lg:grid lg:grid-cols-[2fr,0.5fr,3fr] lg:gap-y-16">
          <section className="w-3/5 mx-auto lg:w-full">
            <h3 className="font-bold mb-4">{commonT('purchaseDetails.summary')}</h3>
            <ul>
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
          <Divider className="hidden lg:block place-self-center" orientation="vertical" flexItem />
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
              className="lg:w-full"
            />
          </div>
          <Divider className="block lg:hidden" flexItem />
          <section className="lg:my-0">
            <h3 className="font-bold mb-2 lg:mb-4 text-center lg:text-left">
              {t('salesAndOrders.modal.history.title')}
            </h3>
            <ul className="flex flex-col gap-4 lg:gap-2">
              {props.order.status_history.map((s) => (
                <li key={s.timestamp + s.status}>
                  {t('salesAndOrders.status.' + s.status)} - {formatTimestamp(s.timestamp)}
                </li>
              ))}
            </ul>
          </section>
          <Divider className="hidden lg:block place-self-center" orientation="vertical" flexItem />
          <Divider className="block lg:hidden" flexItem />
          <section className="flex flex-col">
            <h3 className="font-bold mb-4 lg:mb-2 text-center lg:text-left">
              {t('salesAndOrders.modal.feedback.title')}
            </h3>
            <form className="flex flex-col w-full items-center gap-y-4 lg:gap-y-0 lg:w-auto lg:items-start">
              <label
                id="rating"
                data-disabled={cannotGiveFeedback}
                className="flex items-center gap-2 mb-2"
              >
                <span>{t('salesAndOrders.modal.feedback.rate')}</span>
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
