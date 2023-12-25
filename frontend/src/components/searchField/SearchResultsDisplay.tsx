import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { PaginatedItem, YugiohCardInSet } from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { searchRules } from '../../constants/searchRules';

type SearchResultsDisplayProps = {
  results: PaginatedItem<YugiohCardInSet>;
  query: string;
  onClose: () => void;
};

function SearchResultsDisplay(props: SearchResultsDisplayProps): JSX.Element {
  const { results } = props.results;
  if (results.length === 0) {
    return <></>;
  }

  const firstFourResults = results.filter((_, i) => i < 4);

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
      {firstFourResults.map((r) => (
        <SearchResultItem onClose={props.onClose} key={r.id} data={r} />
      ))}
      <BottomDisplayText
        onClose={props.onClose}
        results={props.results}
        query={props.query}
      ></BottomDisplayText>
    </List>
  );
}

type SearchResultItemProps = {
  data: YugiohCardInSet;
  onClose: () => void;
};

function SearchResultItem(props: SearchResultItemProps): JSX.Element {
  const { data, onClose } = props;
  return (
    <ListItemButton
      sx={{
        ':hover': {
          backgroundColor: '#15B58D33',
        },
      }}
      href={`/details/yugioh/${data.id}`}
      onClick={onClose}
    >
      <ListItemIcon sx={{ color: 'black' }}>
        <CameraAltIcon />
      </ListItemIcon>
      <ListItemText>
        <div className="flex items-center">
          <div className="flex mr-8">{data.set.set_code}</div>
          <div className="w-full">{data.yugioh_card.card_name}</div>
        </div>
      </ListItemText>
    </ListItemButton>
  );
}

function BottomDisplayText(props: SearchResultsDisplayProps) {
  const { results } = props;
  const { count } = results;
  if (count <= searchRules.maxSearchFieldDisplayResults) {
    return <></>;
  }

  return (
    <ListItemButton
      sx={{ marginBottom: 0, borderTop: '1px solid rgb(229, 231, 235)' }}
      dense
      className="w-full"
      href={`/search/${props.query}`}
      onClick={props.onClose}
    >
      <Typography fontSize={10} className="text-center w-full" color="text.secondary">
        Show all ({count} results)
      </Typography>
    </ListItemButton>
  );
}

export default SearchResultsDisplay;
