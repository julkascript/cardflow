import { useTranslation } from 'react-i18next';
import { YugiohCardInSet } from '../../../services/yugioh/types';
import YugiohCardDetailsCell from './YugiohCardDetailsCell';

type YugiohCardDetailsTableProps = {
  cardInSet: YugiohCardInSet;
};

function YugiohCardDetailsTable(props: YugiohCardDetailsTableProps): JSX.Element {
  const { t } = useTranslation('buy');

  return (
    <table className="bg-white border-spacing-0 border-separate rounded-lg border-2 w-11/12 lg:w-1/2 h-[300px]">
      <thead>
        <tr className="text-left">
          <th className="pl-8 pr-8 pt-2 pb-2" colSpan={2}>
            {t('cardDetails.dataTable.tableHeaders.title')}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <YugiohCardDetailsCell
            heading={t('cardDetails.dataTable.tableHeaders.set')}
            data={props.cardInSet.set.set_code}
          />
          <YugiohCardDetailsCell
            heading={t('cardDetails.dataTable.tableHeaders.availableItems')}
            data="448"
          />
        </tr>
        <tr>
          <YugiohCardDetailsCell
            heading={t('cardDetails.dataTable.tableHeaders.number')}
            data="032"
          />
          <YugiohCardDetailsCell heading="From" data="$ 3.03" />
        </tr>
        <tr>
          <YugiohCardDetailsCell
            heading={t('cardDetails.dataTable.tableHeaders.rarity')}
            data={props.cardInSet.rarity.rarity}
          />
          <YugiohCardDetailsCell
            heading={t('cardDetails.dataTable.tableHeaders.thirtyDaysAveragePrice')}
            data={<>$&nbsp;5.14</>}
          />
        </tr>
      </tbody>
    </table>
  );
}

export default YugiohCardDetailsTable;
