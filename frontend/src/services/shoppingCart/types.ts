import { YugiohCardListing } from '../yugioh/types';

export type ShoppingCartItem = {
  id: number;
  cart_name: string;
  listing: YugiohCardListing;
  quantity: number;
  total_price: number;
};

export type AddShoppingCartItem = {
  listing_id: number;
  quantity: number;
};

export type CreatedShoppingCartItem = {
  id: number;
  listing_id: number;
  quantity: number;
};

export type Checkout = {
  delivery_address: string;
};
