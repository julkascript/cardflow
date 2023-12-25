import { Link } from '@mui/material';
import { YugiohCardInSet } from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

type SearchTableCellProps = {
  card: YugiohCardInSet;
};

function SearchTableRow(props: SearchTableCellProps): JSX.Element {
  return (
    <tr>
      <td>
        <CameraAltIcon />
      </td>
      <td>{props.card.set.set_code}</td>
      <td className="w-[250px] font-bold">
        <Link href={`/details/yugioh/${props.card.id}`}>{props.card.yugioh_card.card_name}</Link>
      </td>
      <td>{props.card.rarity.rarity}</td>
    </tr>
  );
}

export default SearchTableRow;
