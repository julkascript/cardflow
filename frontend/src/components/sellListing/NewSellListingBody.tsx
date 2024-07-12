import React, { useMemo, useState } from 'react';
import {
  Autocomplete,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { YugiohCardInSet } from '../../services/yugioh/types';
import { useDebounce } from '../../util/useDebounce';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useToast } from '../../util/useToast';
import { Link, useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Search } from '@mui/icons-material';

type SearchResults = {
  id: number;
  label: string;
  setCode: string;
  name: string;
  image: string;
  rarity: string;
};

const NewListingBody: React.FC = () => {
  const [results, setResults] = useState<YugiohCardInSet[]>([]);
  const navigate = useNavigate();

  const searchResults = useMemo<SearchResults[]>(
    () =>
      results.map((r) => ({
        id: r.id,
        label: `${r.set.set_code} ${r.yugioh_card.card_name}`,
        setCode: r.set.set_code,
        name: r.yugioh_card.card_name,
        image: r.yugioh_card.image,
        rarity: r.rarity.rarity_code,
      })),
    [results],
  );
  const { error } = useToast();

  const handleChange = useDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
    yugiohService
      .searchCardsByName(event.target.value)
      .then((data) => setResults(data.results))
      .catch((err) => error({ error: err }));
  }, 500);

  function handleSelect(_event: any, option: string | SearchResults | null) {
    if (option && typeof option !== 'string') {
      navigate(`/sell/new/${option.id}`);
    }
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-8">
      <div className="bg-white w-11/12 lg:w-5/6 lg:gap-0 gap-4 mx-auto p-8 flex flex-col lg:flex-row items-center border">
        <div className="w-1/2 lg:w-1/4 pb-[50%] lg:pb-[30%] bg-neutral-50 border border-stone-500"></div>
        <div className="md:self-start lg:ml-12 mx-auto w-full md:w-[400px]">
          <Autocomplete
            freeSolo
            handleHomeEndKeys
            selectOnFocus
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
            options={searchResults}
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
                <Link
                  to={`/sell/new/${option.id}`}
                  key={option.id + option.name + option.rarity + 'new-listing'}
                >
                  <MenuItem {...propsWithoutKey} className="flex gap-6 w-full">
                    <Tooltip
                      title={<TooltipImage imageUrl={option.image} />}
                      placement="left-start"
                    >
                      <ListItemIcon sx={{ color: 'black' }}>
                        <CameraAltIcon />
                      </ListItemIcon>
                    </Tooltip>
                    <div className="flex items-center text-sm md:text-base">
                      <div className="w-20">{option.setCode}</div>
                      <div>{option.name}</div>
                    </div>
                  </MenuItem>
                </Link>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

type TooltipImageProps = {
  imageUrl: string;
};

function TooltipImage(props: TooltipImageProps) {
  return <img src={props.imageUrl} className="w-64" alt="" />;
}

export default NewListingBody;
