import { YugiohCardListing } from '../yugioh/types';

export type acception = 'completed' | 'rejected';
export type orderState = 'ordered' | 'sent' | acception | 'not received';

export type Order = {
  order_id: number;
  sender_user: {
    id: number;
    username: string;
    email: string;
  };
  receiver_user: {
    id: number;
    username: string;
    email: string;
  };
  order_items: OrderItem[];
  status: orderState;
  delivery_address: string;
  status_history: StatusHistory[];
};

export type OrderItem = {
  listing: YugiohCardListing;
  quantity: number;
};

export type StatusHistory = {
  status: orderState;
  timestamp: string;
};
