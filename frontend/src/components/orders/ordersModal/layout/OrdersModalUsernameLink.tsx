import { Link } from '@mui/material';
import { Order } from '../../../../services/orders/types';

type OrdersModalUsernameLinkProps = {
  userPosition: 'seller' | 'buyer';
  order: Order;
};

function OrdersModalUsernameLink(props: OrdersModalUsernameLinkProps): JSX.Element {
  const userToDisplay =
    props.userPosition === 'seller' ? props.order.receiver_user : props.order.sender_user;
  return (
    <div className="lg:text-left text-center mb-4">
      <Link
        href={`/user/${userToDisplay.username}`}
        sx={{ color: '#0B70E5', fontSize: 20 }}
        underline="hover"
        className="font-bold"
      >
        {userToDisplay.username}
      </Link>
    </div>
  );
}

export default OrdersModalUsernameLink;
