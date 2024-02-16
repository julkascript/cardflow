import { Link } from '@mui/material';
import { YugiohCardInSet } from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

type SearchTableCellProps = {
  card: YugiohCardInSet;
};

function SearchTableRow(props: SearchTableCellProps): JSX.Element {
  return (
    <tr>
      <td className="w-[100px]">
        <CameraAltIcon />
      </td>
      <td className="w-[100px]">{props.card.set.set_code}</td>
      <td className="w-[150px] font-bold">
        <Link href={`/details/yugioh/${props.card.id}`}>{props.card.yugioh_card.card_name}</Link>
      </td>
      <td className="w-[250px]">{props.card.rarity.rarity}</td>
    </tr>
  );
}

export default SearchTableRow;
