import { UserFeedback } from '../../services/feedback/types';
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
  feedbacks: UserFeedback | undefined;
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
            feedback={props.feedbacks?.all_comments_and_ratings?.find(
              (f) => f.related_order === o.order_id,
            )}
          />
        ))}
      </tbody>
    </MarketTable>
  );
}

export default OrdersTable;
