import { Badge, Link } from '@mui/material';
import { Order } from '../../services/orders/types';
import { orderStates } from '../../constants/orders';

type OrdersTableRowProps = {
  order: Order;
  userPosition: 'buyer' | 'seller';
};

function OrdersTableRow(props: OrdersTableRowProps): JSX.Element {
  return (
    <tr>
      <td style={{ paddingLeft: 16 }}>{props.order.id}</td>
      <td style={{ paddingLeft: 16 }}>
        <Link underline="hover" sx={{ color: '#0B70E5' }} href={`/user/${props.order.user}`}>
          {props.order.user}
        </Link>
      </td>
      <td style={{ paddingLeft: 16 }}>{props.order.quantity}</td>
      <td style={{ paddingLeft: 16 }}>${props.order.total}</td>
      <td style={{ paddingLeft: 16 }}>
        <Badge
          invisible={!(props.userPosition === 'buyer' && props.order.state === 'ordered')}
          badgeContent=" "
          color="error"
        >
          <div className="pr-2">{orderStates[props.order.state]}</div>
        </Badge>
      </td>
    </tr>
  );
}

export default OrdersTableRow;
