import { orderState } from '../services/orders/types';

export const orderStates: Readonly<Record<orderState, string>> = Object.freeze({
  sent: 'Sent',
  ordered: 'Ordered',
  received: 'Received',
  'not received': 'Not received',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
});
