import { useEffect, useState } from 'react';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import OrdersTable from '../../components/orders/OrdersTable';
import { useCurrentUser } from '../../context/user';
import { Order } from '../../services/orders/types';
import { orderService } from '../../services/orders/orderService';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import { useToast } from '../../util/useToast';
import { useTranslation } from 'react-i18next';

function Sales(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const toast = useToast();

  const { t } = useTranslation('common');

  const { user } = useCurrentUser();
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: t('breadcrumbs.account.title'),
      href: `/user/${user.username}`,
    },
  ];

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  function updateOrders() {
    orderService
      .getSales(user.username, page)
      .then((data) => {
        setOrders(data.results);
        setCount(data.count);
      })
      .catch((error) => toast.error({ error }));
  }

  useEffect(() => {
    if (user.username) {
      orderService
        .getSales(user.username, page)
        .then((data) => {
          setOrders(data.results);
          setCount(data.count);
        })
        .catch((error) => toast.error({ error }));
    }
  }, [user, page]);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation
        heading={t('breadcrumbs.account.mySales.title')}
        links={breadcrumbNavigation}
      />
      <div className="flex flex-col lg:items-center overflow-auto">
        <OrdersTable
          updateOrders={updateOrders}
          page={page}
          onChangePage={setPage}
          count={count}
          orders={orders}
          userPosition="seller"
        />
      </div>
    </section>
  );
}

export default Sales;
