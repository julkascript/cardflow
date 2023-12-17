import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  YugiohCardSearchResults,
  YugiohCardSearchResultsDisplay,
} from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { searchRules } from '../../constants/searchRules';

type SearchResultsDisplayProps = {
  results: YugiohCardSearchResultsDisplay;
  query: string;
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
        paddingBottom: 0,
      }}
    >
      {results.map((r) => (
        <SearchResultItem key={r.card.card_in_set_id} data={r} />
      ))}
      <BottomDisplayText results={props.results} query={props.query}></BottomDisplayText>
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
          <div className="flex mr-8">{data.card.set.set_code}</div>
          <div className="w-full">{data.cardName}</div>
        </div>
      </ListItemText>
    </ListItemButton>
  );
}

function BottomDisplayText(props: SearchResultsDisplayProps) {
  const { results } = props;
  const { total } = results;
  if (total <= searchRules.maxSearchFieldDisplayResults) {
    return <></>;
  }

  return (
    <ListItemButton
      sx={{ marginBottom: 0, borderTop: '1px solid rgb(229, 231, 235)' }}
      dense
      className="w-full"
      href={`/search/${props.query}`}
    >
      <Typography fontSize={10} className="text-center w-full" color="text.secondary">
        Show all ({total} results)
      </Typography>
    </ListItemButton>
  );
}

export default SearchResultsDisplay;
