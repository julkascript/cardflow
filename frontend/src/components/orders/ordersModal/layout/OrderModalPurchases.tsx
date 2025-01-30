import { useTranslation } from 'react-i18next';
import { Order } from '../../../../services/orders/types';
import MarketTable from '../../../marketTable/MarketTable';
import { useCurrentUser } from '../../../../context/user';

type OrderModalPurchasesProps = {
  order: Order;
};

function OrdersModalPurchases(props: OrderModalPurchasesProps): JSX.Element {
  const { t } = useTranslation('common');
  const { user } = useCurrentUser();

  return (
    <div className="flex mt-4 mb-8 lg:justify-center w-full overflow-auto">
      <MarketTable className="text-center w-full">
        <thead>
          <tr>
            <th colSpan={2}>{t('purchaseDetails.table.tableHeaders.cardDetails')}</th>
            <th>{t('purchaseDetails.table.tableHeaders.quantity')}</th>
            <th>{t('purchaseDetails.table.tableHeaders.price')}</th>
          </tr>
        </thead>
        <tbody>
          {props.order.order_items.map((o) => (
            <tr key={o.listing.id}>
              <td className="font-bold">{o.listing.card_name}</td>
              <td>{o.listing.card_in_set.set.set_code}</td>
              <td>{o.quantity}</td>
              <td className="font-bold">
                {o.listing.price * o.quantity} {user.currency_preference}
              </td>
            </tr>
          ))}
        </tbody>
      </MarketTable>
    </div>
  );
}

export default OrdersModalPurchases;
