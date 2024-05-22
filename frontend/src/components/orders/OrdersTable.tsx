import { Order } from '../../services/orders/types';
import MarketTable from '../marketTable/MarketTable';
import OrdersTableRow from './OrdersTableRow';

type OrdersTableProps = {
  /**
   * If used in the My orders page, use ``buyer``, otherwise, use ``seller``
   */
  userPosition: 'seller' | 'buyer';
  orders: Order[];
  page: number;
  onChangePage: (page: number) => void;
  count: number;
  updateOrders: () => void;
};

function OrdersTable(props: OrdersTableProps): JSX.Element {
  const userPosition = props.userPosition === 'buyer' ? 'Seller' : 'Buyer';
  return (
    <MarketTable
      page={props.page}
      onPageChange={props.onChangePage}
      count={props.count}
      className="w-full rounded-md mt-4 lg:w-10/12 text-left"
    >
      <thead>
        <tr>
          <th>Order</th>
          <th>{userPosition}</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>State</th>
          <th>Review order</th>
        </tr>
      </thead>
      <tbody>
        {props.orders.map((o) => (
          <OrdersTableRow
            updateOrder={props.updateOrders}
            userPosition={props.userPosition}
            key={o.order_id}
            order={o}
          />
        ))}
      </tbody>
    </MarketTable>
  );
}

export default OrdersTable;
