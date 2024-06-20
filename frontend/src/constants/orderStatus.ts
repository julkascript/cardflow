import { orderState } from '../services/orders/types';

export const orderStatus: Readonly<Record<orderState, string>> = Object.freeze({
  ordered: 'Ordered',
  completed: 'Received',
  sent: 'Sent',
  rejected: 'Rejected',
  not_sent: 'Not sent',
  not_received: 'Not received',
});
