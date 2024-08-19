import {
  Autocomplete,
  Avatar,
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
import PaidIcon from '@mui/icons-material/Paid';
import { useTranslation } from 'react-i18next';

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
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useTranslation('trade');

  let updateCash: typeof addInitiatorListingOrCash | typeof addRecipientListingOrCash;
  let defaultCashValue: number;
  let user: TradeParticipant;
  let userListings: YugiohCardListing[];

  if (props.user.id === trade.initiator.id) {
    user = trade.initiator;
    updateCash = addInitiatorListingOrCash;
    defaultCashValue = trade.initiator_cash || 0;
    userListings = trade.initiator_listing;
  } else {
    user = trade.recipient;
    updateCash = addRecipientListingOrCash;
    defaultCashValue = trade.recipient_cash || 0;
    userListings = trade.recipient_listing;
  }

  const [cash, setCash] = useState(defaultCashValue);

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

  const changeCash = useDebounce((value: number) => {
    updateCash(value);
  }, 500);

  function handleCashChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value >= 0) {
      setCash(value);
      changeCash(value);
    }
  }

  const handleChange = useDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
    yugiohService
      .searchYugiohListingsByCardNameAndUserId(event.target.value, props.user.id)
      .then((data) => {
        setResults(
          data.results.filter((listing) => !userListings.find((l) => l.id === listing.id)),
        );
        setHasSearched(true);
      })
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
        .catch(error)
        .finally(() => {
          setHasSearched(false);
          setResults([]);
        });
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <div className="flex gap-4 items-center mb-4 justify-center lg:justify-start">
          <Avatar sx={{ width: 33, height: 33 }} src={user.avatar || undefined} />
          <h3>{props.user.username}</h3>
        </div>
        {results.length || !hasSearched ? null : (
          <p className="text-center lg:text-left">{t('modal.noResults')}</p>
        )}
      </div>
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
            size="small"
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
      <TextField
        size="small"
        type="number"
        className="w-full"
        value={cash}
        onChange={handleCashChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PaidIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

type TooltipImageProps = {
  imageUrl: string;
};

function TooltipImage(props: TooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="" />;
}

export default TradeModalSearch;
