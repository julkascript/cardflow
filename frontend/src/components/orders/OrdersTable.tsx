import { Order } from '../../services/orders/types';
import MarketTable from '../marketTable/MarketTable';
import OrdersTableRow from './OrdersTableRow';

type OrdersTableProps = {
  /**
   * If used in the My orders page, use ``seller``, otherwise, use ``buyer``
   */
  userPosition: 'seller' | 'buyer';
  orders: Order[];
};

function OrdersTable(props: OrdersTableProps): JSX.Element {
  const userPosition = props.userPosition === 'seller' ? 'Seller' : 'Buyer';
  return (
    <MarketTable className="w-full rounded-md mt-4 lg:w-10/12 text-left">
      <thead>
        <tr>
          <th>Order</th>
          <th>{userPosition}</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {props.orders.map((o) => (
          <OrdersTableRow userPosition={props.userPosition} key={o.id} order={o} />
        ))}
      </tbody>
    </MarketTable>
  );
}

export default OrdersTable;
