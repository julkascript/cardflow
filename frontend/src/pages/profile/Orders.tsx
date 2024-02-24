import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import OrdersTable from '../../components/orders/OrdersTable';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import { useCurrentUser } from '../../context/user';
import { Order } from '../../services/orders/types';

function Orders(): JSX.Element {
  const orders: Order[] = [
    {
      id: 1,
      user: 'admin',
      quantity: 5,
      total: 20,
      state: 'sent',
    },
  ];

  const { user } = useCurrentUser();
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: 'Account',
      href: `/user/${user.username}`,
    },
  ];

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <ListingTopBar />
      <BreadcrumbNavigation heading="My orders" links={breadcrumbNavigation} />
      <div className="flex flex-col lg:items-center overflow-auto">
        <OrdersTable orders={orders} userPosition="seller" />
      </div>
    </section>
  );
}

export default Orders;
