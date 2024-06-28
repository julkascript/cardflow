import { orderState } from '../services/orders/types';

export const orderStates: Readonly<Record<orderState, string>> = Object.freeze({
  sent: 'Sent',
  ordered: 'Ordered',
  completed: 'Received',
  not_sent: 'Not sent',
  not_received: 'Not received',
  rejected: 'Rejected',
});
