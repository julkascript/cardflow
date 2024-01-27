import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { PaginatedItem } from '../yugioh/types';
import { AddShoppingCartItem, Checkout, CreatedShoppingCartItem, ShoppingCartItem } from './types';

export const shoppingCartService = {
  async getItems(
    listingUsername?: string,
    page?: number,
  ): Promise<PaginatedItem<ShoppingCartItem>> {
    const data = await httpService.get<PaginatedItem<ShoppingCartItem>>(api.shoppingCart.items, {
      page: page || 1,
      listingUsername,
    });

    return data!;
  },

  async addItem(item: AddShoppingCartItem): Promise<CreatedShoppingCartItem> {
    const data = await httpService.post<CreatedShoppingCartItem>(api.shoppingCart.items, item);
    return data!;
  },

  async deleteItem(id: number): Promise<void> {
    await httpService.del(api.shoppingCart.id(id));
  },

  async checkout(body: Checkout): Promise<Checkout> {
    const data = await httpService.post<Checkout>(api.shoppingCart.checkout, body);
    return data!;
  },
};
