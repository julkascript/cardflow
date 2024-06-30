import { useTranslation } from 'react-i18next';
import MarketActivityTableCell from './MarketActivityTableCell';

function ProfileMarketActivity(): JSX.Element {
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
            <MarketActivityTableCell heading={t('public.marketActivity.purchases')} data={144} />
            <MarketActivityTableCell heading={t('public.marketActivity.sales')} data={10_143} />
          </tr>
          <tr>
            <MarketActivityTableCell heading={t('public.marketActivity.salesThisMonth')} data={0} />
            <MarketActivityTableCell heading={t('public.marketActivity.saleRating')} data="3.9/5" />
          </tr>
          <tr>
            <MarketActivityTableCell heading={t('public.marketActivity.rejectionRate')} data={45} />
            <MarketActivityTableCell heading={t('public.marketActivity.missRate')} data={123_456} />
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default ProfileMarketActivity;
