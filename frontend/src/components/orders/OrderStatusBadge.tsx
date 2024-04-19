import { orderState } from '../../services/orders/types';
import { CheckCircle, DoNotDisturbAlt, Outbound, DoNotDisturbOn } from '@mui/icons-material';

type OrderStatusBadgeProps = {
  orderState: orderState;
};

const iconsPerStatus: Record<orderState, React.ReactNode> = {
  rejected: <DoNotDisturbAlt color="error" />,
  sent: <Outbound className="-rotate-45" color="primary" />,
  ordered: <Outbound className="-rotate-45" color="primary" />,
  'not received': <DoNotDisturbOn color="error" />,
  completed: <CheckCircle color="success" />,
};

function OrderStatusBadge(props: OrderStatusBadgeProps): JSX.Element {
  return <>{iconsPerStatus[props.orderState]}</>;
}

export default OrderStatusBadge;
