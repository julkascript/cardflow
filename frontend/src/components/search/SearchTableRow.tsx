import { Link } from '@mui/material';
import { YugiohCardSearchResults } from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

type SearchTableCellProps = {
  card: YugiohCardSearchResults;
};

function SearchTableRow(props: SearchTableCellProps): JSX.Element {
  return (
    <tr>
      <td>
        <CameraAltIcon />
      </td>
      <td>{props.card.card.set.set_code}</td>
      <td className="w-[250px] font-bold">
        <Link href={`/details/yugioh/${props.card.card.card_in_set_id}`}>
          {props.card.cardName}
        </Link>
      </td>
      <td>{props.card.card.rarity.rarity}</td>
    </tr>
  );
}

export default SearchTableRow;
