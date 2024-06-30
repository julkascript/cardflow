import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('account');

  return (
    <MarketTable
      page={props.page}
      onPageChange={props.onChangePage}
      count={props.count}
      className="w-full rounded-md mt-4 lg:w-10/12 text-left"
    >
      <thead>
        <tr>
          <th>{t('salesAndOrders.table.tableHeaders.order')}</th>
          <th>{t('salesAndOrders.table.tableHeaders.user', { context: props.userPosition })}</th>
          <th>{t('salesAndOrders.table.tableHeaders.quantity')}</th>
          <th>{t('salesAndOrders.table.tableHeaders.total')}</th>
          <th>{t('salesAndOrders.table.tableHeaders.state')}</th>
          <th>{t('salesAndOrders.table.tableHeaders.reviewOrder')}</th>
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
