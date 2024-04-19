import { orderState } from '../services/orders/types';

export const orderStatus: Readonly<Record<orderState, string>> = Object.freeze({
  ordered: 'Ordered',
  completed: 'Received',
  sent: 'Sent',
  rejected: 'Rejected',
  'not received': 'Not received',
});
