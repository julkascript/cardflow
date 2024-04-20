import { orderState } from '../services/orders/types';

export const orderStates: Readonly<Record<orderState, string>> = Object.freeze({
  sent: 'Sent',
  ordered: 'Ordered',
  completed: 'Received',
  // 'not received': 'Not received',
  rejected: 'Rejected',
});
