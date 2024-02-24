export type acception = 'accepted' | 'rejected';
export type reception = 'received' | 'not received';
export type orderState = 'ordered' | 'sent' | acception | reception | 'completed';

export type Order = {
  id: number;
  user: string;
  quantity: number;
  total: number;
  state: orderState;
};
