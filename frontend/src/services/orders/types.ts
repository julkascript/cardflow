export type acception = 'received' | 'rejected';
export type orderState = 'ordered' | 'sent' | acception | 'not received';

export type Order = {
  id: number;
  user: string;
  quantity: number;
  total: number;
  state: orderState;
};
