import { useTranslation } from 'react-i18next';
import MarketActivityTableCell from './MarketActivityTableCell';
import { ProfilePublicDataProps } from '../ProfilePublicData';

function ProfileMarketActivity(props: ProfilePublicDataProps): JSX.Element {
  const { t } = useTranslation('account');

  return (
    <section>
      <table className="border-stone-300 bg-white border-spacing-0 border-separate rounded-lg border-2 w-full">
        <thead>
          <tr>
            <th colSpan={2} className="text-center lg:text-left p-4 lg:pl-12 lg:pr-12">
              {t('public.marketActivity.heading')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <MarketActivityTableCell heading={t('public.marketActivity.purchases')} data={props.user.stats.purchases} />
            <MarketActivityTableCell heading={t('public.marketActivity.sales')} data={props.user.stats.sales} />
          </tr>
          <tr>
            <MarketActivityTableCell heading={t('public.marketActivity.salesThisMonth')} data={props.user.stats.sales_this_month} />
            <MarketActivityTableCell heading={t('public.marketActivity.saleRating')} data={`${props.user.stats.seller_rating}/5`} />
          </tr>
          <tr>
            <MarketActivityTableCell heading={t('public.marketActivity.rejectionRate')} data={`${props.user.stats.rejection_rate}%`} />
            <MarketActivityTableCell heading={t('public.marketActivity.missRate')} data={`${props.user.stats.miss_rate}%`} />
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default ProfileMarketActivity;
