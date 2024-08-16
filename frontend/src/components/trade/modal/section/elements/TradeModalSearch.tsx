import {
  Autocomplete,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { YugiohCardListing } from '../../../../../services/yugioh/types';
import { useToast } from '../../../../../util/useToast';
import { useDebounce } from '../../../../../util/useDebounce';
import { yugiohService } from '../../../../../services/yugioh/yugiohService';
import { Search } from '@mui/icons-material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useTrade } from '../../../../../context/trade';
import { TradeParticipant } from '../../../../../services/trade/types';

type SearchResults = {
  id: number;
  label: string;
  setCode: string;
  name: string;
  image: string;
  rarity: string;
};

type TradeModalSearchProps = {
  user: TradeParticipant;
};

function TradeModalSearch(props: TradeModalSearchProps): JSX.Element {
  const [results, setResults] = useState<YugiohCardListing[]>([]);
  const { trade, addInitiatorListingOrCash, addRecipientListingOrCash } = useTrade();

  const searchResults = useMemo<SearchResults[]>(
    () =>
      results.map((r) => ({
        id: r.id,
        label: `${r.card_in_set.rarity.rarity} ${r.card_in_set.yugioh_card.card_name}`,
        setCode: r.card_in_set.set.set_code,
        name: r.card_in_set.yugioh_card.card_name,
        image: r.card_in_set.yugioh_card.image,
        rarity: r.card_in_set.rarity.rarity,
      })),
    [results],
  );
  const { error } = useToast();

  const handleChange = useDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
    yugiohService
      .searchYugiohListingsByCardNameAndUserId(event.target.value, props.user.id)
      .then((data) => setResults(data.results))
      .catch((err) => error({ error: err }));
  }, 500);

  function handleSelect(_event: any, option: string | SearchResults | null) {
    if (option && typeof option !== 'string') {
      yugiohService
        .getListingById(option.id)
        .then((listing) => {
          if (trade.recipient.id === props.user.id) {
            addRecipientListingOrCash(listing);
          } else {
            addInitiatorListingOrCash(listing);
          }
        })
        .catch(error);
    }
  }
  return (
    <Autocomplete
      freeSolo
      handleHomeEndKeys
      selectOnFocus
      options={searchResults}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          onChange={handleChange}
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        /**
         * Spreading the key into the MenuItem causes React to complain
         *
         * props is typed as ``any`` because TypeScript doesn't recognize
         * ``key`` as a valid property (despite it actually existing).
         * This is apparently a typing issue fixed in a later version, might
         * be worth upgrading to remove casting
         */

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key: _key, ...propsWithoutKey } = props as any;

        return (
          <MenuItem
            key={option.id + option.name + option.rarity + 'listing'}
            {...propsWithoutKey}
            className="flex gap-6 w-full"
          >
            <Tooltip title={<TooltipImage imageUrl={option.image} />} placement="left-start">
              <ListItemIcon sx={{ color: 'black' }}>
                <CameraAltIcon />
              </ListItemIcon>
            </Tooltip>
            <div className="flex items-center text-sm md:text-base">
              <div className="w-20">{option.setCode}</div>
              <div>{option.name}</div>
            </div>
          </MenuItem>
        );
      }}
    ></Autocomplete>
  );
}

type TooltipImageProps = {
  imageUrl: string;
};

function TooltipImage(props: TooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="" />;
}

export default TradeModalSearch;
