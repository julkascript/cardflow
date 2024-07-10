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
import { useTranslation } from 'react-i18next';

type SearchResultsDisplayProps = {
  results: PaginatedItem<YugiohCardInSet>;
  query: string;
  isListing?: boolean;
  onClose: () => void;
};

type SearchResultItemProps = {
  data: YugiohCardInSet;
  onClose: () => void;
  isListing?: boolean;
};

type TooltipImageProps = {
  imageUrl: string;
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
        backgroundColor: 'white',
        paddingBottom: 0,
      }}
    >
      {firstFourResults.map((r) => (
        <SearchResultItem isListing={props.isListing} onClose={props.onClose} key={r.id} data={r} />
      ))}
      <BottomDisplayText
        onClose={props.onClose}
        results={props.results}
        query={props.query}
      ></BottomDisplayText>
    </List>
  );
}

function TooltipImage(props: TooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="" />;
}

function SearchResultItem(props: SearchResultItemProps): JSX.Element {
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
      <Tooltip title={<TooltipImage imageUrl={data.yugioh_card.image} />} placement="left-start">
        <ListItemIcon sx={{ color: 'black' }}>
          <CameraAltIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText>
        <div className="flex items-center text-sm md:text-base">
          <div className="flex mr-8">{data.set.set_code}</div>
          <div className="w-full">{data.yugioh_card.card_name}</div>
        </div>
      </ListItemText>
    </ListItemButton>
  );
}

function BottomDisplayText(props: SearchResultsDisplayProps) {
  const { t } = useTranslation('common');
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
        {t('search.showAll', { results: count })}
      </Typography>
    </ListItemButton>
  );
}

export default SearchResultsDisplay;
