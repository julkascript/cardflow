import { useEffect, useState } from 'react';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import OrdersTable from '../../components/orders/OrdersTable';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import { useCurrentUser } from '../../context/user';
import { Order } from '../../services/orders/types';
import { orderService } from '../../services/orders/orderService';
import { errorToast } from '../../util/errorToast';
import { UserFeedback } from '../../services/feedback/types';
import { feedbackService } from '../../services/feedback/feedback';

function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback>({
    user: 0,
    all_comments_and_ratings: [],
    average_rating: 0,
  });

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
      .getOrders(user.username, page)
      .then((data) => {
        setOrders(data.results);
        setCount(data.count);
        return feedbackService.getUserFeedbacks(user.user_id);
      })
      .then(setFeedbacks)
      .catch(errorToast);
  }

  useEffect(() => {
    if (user.username) {
      orderService
        .getOrders(user.username, page)
        .then((data) => {
          setOrders(data.results);
          setCount(data.count);
          return feedbackService.getUserFeedbacks(user.user_id);
        })
        .then((data) => {
          setFeedbacks(data);
        })
        .catch(errorToast);
    }
  }, [user, page]);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <ListingTopBar />
      <BreadcrumbNavigation heading="My orders" links={breadcrumbNavigation} />
      <div className="flex flex-col lg:items-center overflow-auto">
        <OrdersTable
          page={page}
          onChangePage={setPage}
          count={count}
          orders={orders}
          userPosition="buyer"
          updateOrders={updateOrders}
          feedbacks={feedbacks}
        />
      </div>
    </section>
  );
}

export default Orders;
