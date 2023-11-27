import { determineSellerRank } from '../../../util/determineSellerRank';

type YugiohSellerRankLabelProps = {
  sales: number;
};

/**
 * Renders a label that displays the sales amount in the appropriate colors.
 * Large numbers are displayed in a shortened format.
 */
function YugiohSellerRankLabel(props: YugiohSellerRankLabelProps): JSX.Element {
  const number = generateNumberLabel(props.sales);
  const colors = determineSellerRank(props.sales);

  return (
    <div
      className="border rounded-sm pr-2 pl-2 w-[50px] text-center"
      style={{ color: colors.textColor, borderColor: colors.textColor }}
    >
      {number}
    </div>
  );
}

function generateNumberLabel(sales: number) {
  if (sales >= 1000) {
    const number = sales / 1000;
    return number + 'K';
  }

  return sales.toString();
}

export default YugiohSellerRankLabel;
