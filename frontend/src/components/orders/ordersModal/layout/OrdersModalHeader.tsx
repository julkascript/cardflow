import { Link } from '@mui/material';
import { Order } from '../../../../services/orders/types';
import OrderStatusBadge from '../../OrderStatusBadge';
import { useTranslation } from 'react-i18next';

type OrdersModalHeaderProps = {
  order: Order;
};

function OrdersModalHeader(props: OrdersModalHeaderProps): JSX.Element {
  const { t } = useTranslation('account');

  return (
    <section className="flex items-center mb-6 justify-between">
      <div className="flex items-center gap-4 justify-center lg:justify-start">
        <h2 className="font-bold text-4xl">
          {t('salesAndOrders.modal.title')} #{props.order.order_id}
        </h2>
        <OrderStatusBadge orderState={props.order.status} />
      </div>
      <Link href="/about/faq" className="!text-gray-500" target="_blank">
        {t('salesAndOrders.modal.supportButtonText')}
      </Link>
    </section>
  );
}

export default OrdersModalHeader;
