import MarketActivityTableCell from './MarketActivityTableCell';
import { ProfilePublicDataProps } from '../ProfilePublicData';

function ProfileMarketActivity(props: ProfilePublicDataProps): JSX.Element {
  return (
    <section>
      <table className="border-stone-300 bg-white border-spacing-0 border-separate rounded-lg border-2 w-full">
        <thead>
          <tr>
            <th colSpan={2} className="text-center lg:text-left p-4 lg:pl-12 lg:pr-12">
              Market activity
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <MarketActivityTableCell heading="Purchases" data={props.user.stats.purchases} />
            <MarketActivityTableCell heading="Sales" data={props.user.stats.sales} />
          </tr>
          <tr>
            <MarketActivityTableCell
              heading="Sales This Month"
              data={props.user.stats.sales_this_month}
            />
            <MarketActivityTableCell
              heading="Seller Rating"
              data={`${props.user.stats.seller_rating}/5`}
            />
          </tr>
          <tr>
            <MarketActivityTableCell
              heading="Rejection Rate"
              data={`${props.user.stats.rejection_rate}%`}
            />
            <MarketActivityTableCell heading="Miss Rate" data={`${props.user.stats.miss_rate}%`} />
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default ProfileMarketActivity;
