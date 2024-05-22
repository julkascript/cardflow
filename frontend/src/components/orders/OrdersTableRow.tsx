import { Badge, Button, Link } from '@mui/material';
import { Order } from '../../services/orders/types';
import { orderStates } from '../../constants/orders';
import { useEffect, useState } from 'react';
import OrdersModal from './ordersModal/OrdersModal';
import { Feedback } from '../../services/feedback/types';
import { feedbackService } from '../../services/feedback/feedback';

type OrdersTableRowProps = {
  order: Order;
  userPosition: 'buyer' | 'seller';
  updateOrder: () => void;
};

function OrdersTableRow(props: OrdersTableRowProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const quantity = props.order.order_items.reduce((total, order) => total + order.quantity, 0);
  const totalPrice = props.order.order_items.reduce(
    (total, order) => total + order.quantity * order.listing.price,
    0,
  );

  const [feedback, setFeedback] = useState<Feedback>();

  const userToDisplay =
    props.userPosition === 'seller' ? props.order.receiver_user : props.order.sender_user;

  function onClose(closedFromAction?: boolean) {
    setOpen(false);
    if (closedFromAction) {
      props.updateOrder();
    }
  }

  useEffect(() => {
    feedbackService.getUserFeedbacks(props.order.sender_user.id).then((data) => {
      const feedback = data.all_comments_and_ratings.find(
        (feedback) => feedback.related_order === props.order.order_id,
      );

      setFeedback(feedback);
    });
  }, [props.order, props.userPosition]);
  return (
    <>
      <tr>
        <td style={{ paddingLeft: 16 }}>{props.order.order_id}</td>
        <td style={{ paddingLeft: 16 }}>
          <Link
            underline="hover"
            sx={{ color: '#0B70E5' }}
            href={`/user/${userToDisplay.username}`}
          >
            {userToDisplay.username}
          </Link>
        </td>
        <td style={{ paddingLeft: 16 }}>{quantity}</td>
        <td style={{ paddingLeft: 16 }}>${totalPrice}</td>
        <td style={{ paddingLeft: 16 }}>
          <Badge
            invisible={!(props.userPosition === 'seller' && props.order.status === 'ordered')}
            badgeContent=" "
            color="error"
          >
            <div className="pr-2">{orderStates[props.order.status]}</div>
          </Badge>
        </td>
        <td style={{ paddingLeft: 16 }}>
          <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
            Review order
          </Button>
        </td>
      </tr>
      <OrdersModal
        userPosition={props.userPosition}
        open={open}
        onClose={onClose}
        order={props.order}
        status={props.order.status}
        feedback={feedback}
      />
    </>
  );
}

export default OrdersTableRow;
