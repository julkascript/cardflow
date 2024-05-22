import { useEffect, useState } from 'react';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import OrdersTable from '../../components/orders/OrdersTable';
import { useCurrentUser } from '../../context/user';
import { Order } from '../../services/orders/types';
import { errorToast } from '../../util/errorToast';
import { orderService } from '../../services/orders/orderService';
import CardflowTabs from '../../components/sellListing/CardflowTabs';

function Sales(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const { user } = useCurrentUser();
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: 'Account',
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
      .catch(errorToast);
  }

  useEffect(() => {
    if (user.username) {
      orderService
        .getSales(user.username, page)
        .then((data) => {
          setOrders(data.results);
          setCount(data.count);
        })
        .catch(errorToast);
    }
  }, [user, page]);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation heading="My sales" links={breadcrumbNavigation} />
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
