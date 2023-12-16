import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  YugiohCardSearchResults,
  YugiohCardSearchResultsDisplay,
} from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

type SearchResultsDisplayProps = {
  results: YugiohCardSearchResultsDisplay;
};

function SearchResultsDisplay(props: SearchResultsDisplayProps): JSX.Element {
  const { results } = props.results;
  if (results.length === 0) {
    return <></>;
  }

  return (
    <List
      className="border rounded-lg w-full"
      sx={{
        position: 'absolute',
        zIndex: 500000,
        backgroundColor: 'white',
      }}
    >
      {results.map((r) => (
        <SearchResultItem key={r.card.card_in_set_id} data={r} />
      ))}
    </List>
  );
}

type SearchResultItemProps = {
  data: YugiohCardSearchResults;
};

function SearchResultItem(props: SearchResultItemProps): JSX.Element {
  const { data } = props;
  return (
    <ListItemButton
      sx={{
        ':hover': {
          backgroundColor: '#15B58D33',
        },
      }}
      href={`/details/yugioh/${data.card.card_in_set_id}`}
    >
      <ListItemIcon sx={{ color: 'black' }}>
        <CameraAltIcon />
      </ListItemIcon>
      <ListItemText>
        <div className="flex items-center">
          <div className="w-full flex">{data.card.set.set_code}</div>
          <div className="w-11/12">{data.cardName}</div>
        </div>
      </ListItemText>
    </ListItemButton>
  );
}

export default SearchResultsDisplay;
