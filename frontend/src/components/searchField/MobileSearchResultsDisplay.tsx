import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { PaginatedItem, YugiohCardInSet } from '../../services/yugioh/types';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { searchRules } from '../../constants/searchRules';

type SearchResultsDisplayProps = {
  results: PaginatedItem<YugiohCardInSet>;
  query: string;
  isListing?: boolean;
  onClose: () => void;
};

type MobileSearchResultItemProps = {
  data: YugiohCardInSet;
  onClose: () => void;
  isListing?: boolean;
};

type MobileTooltipImageProps = {
  imageUrl: string;
};

function MobileSearchResultsDisplay(props: SearchResultsDisplayProps): JSX.Element {
  const { results } = props.results;
  if (results.length === 0) {
    return <></>;
  }

  const firstFourResults = results.filter((_, i) => i < 4);

  return (
    <List className="w-full" sx={{ paddingBottom: 0 }}>
      {firstFourResults.map((r) => (
        <MobileSearchResultItem
          isListing={props.isListing}
          onClose={props.onClose}
          key={r.id}
          data={r}
        />
      ))}
      <MobileBottomDisplayText
        onClose={props.onClose}
        results={props.results}
        query={props.query}
      ></MobileBottomDisplayText>
    </List>
  );
}

function MobileTooltipImage(props: MobileTooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="card image" />;
}

function MobileSearchResultItem(props: MobileSearchResultItemProps): JSX.Element {
  const { data, onClose } = props;
  return (
    <ListItemButton
      sx={{
        ':hover': {
          backgroundColor: '#15B58D33',
        },
      }}
      href={props.isListing ? `/sell/new/${data.id}` : `/details/yugioh/${data.id}`}
      onClick={onClose}
    >
      <Tooltip
        title={<MobileTooltipImage imageUrl={data.yugioh_card.image} />}
        placement="left-start"
      >
        <ListItemIcon sx={{ color: 'black' }}>
          <CameraAltIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText>
        <div className="flex items-center">
          <div className="flex ml-4 mr-12">{data.set.set_code}</div>
          <div className="w-full">{data.yugioh_card.card_name}</div>
        </div>
      </ListItemText>
    </ListItemButton>
  );
}

function MobileBottomDisplayText(props: SearchResultsDisplayProps) {
  const { results } = props;
  const { count } = results;
  if (count <= searchRules.maxSearchFieldDisplayResults) {
    return <></>;
  }

  return (
    <ListItemButton
      sx={{ marginBottom: 0, padding: 2, borderTop: '1px solid rgb(229, 231, 235)' }}
      className=""
      href={`/search/${props.query}`}
      onClick={props.onClose}
    >
      <Typography fontSize={14} className="text-center w-full" color="text.secondary">
        Show all ({count} results)
      </Typography>
    </ListItemButton>
  );
}

export default MobileSearchResultsDisplay;
