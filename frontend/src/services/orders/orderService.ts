import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { PaginatedItem } from '../yugioh/types';
import { Order } from './types';

export const orderService = {
  async getOrders(username: string): Promise<PaginatedItem<Order>> {
    const orders = await httpService.get<PaginatedItem<Order>>(api.orders.root, {
      receiver_user: username,
    });

    return orders!;
  },

  async getSales(username: string): Promise<PaginatedItem<Order>> {
    const orders = await httpService.get<PaginatedItem<Order>>(api.orders.root, {
      sender_user: username,
    });

    return orders!;
  },

  async getOrder(id: number): Promise<Order> {
    const order = await httpService.get<Order>(api.orders.id(id));
    return order!;
  },
};
