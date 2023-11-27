import { determineSellerRank } from '../../../util/determineSellerRank';
import StarRateIcon from '@mui/icons-material/StarRate';

type YugiohSellerRankProps = {
  sales: number;
};

/**
 * Renders a star-shaped badge whose colors depend on the passed sales
 */
function YugiohSellerRankBadge(props: YugiohSellerRankProps): JSX.Element {
  const colors = determineSellerRank(props.sales);

  return (
    <StarRateIcon
      sx={{
        color: colors.fill,
        stroke: colors.border,
      }}
    />
  );
}

export default YugiohSellerRankBadge;
