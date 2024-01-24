import { ClickAwayListener, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import SearchButton from '../navigation/desktop/buttons/SearchButton';
import { useDebounce } from '../../util/useDebounce';
import { PaginatedItem, YugiohCardInSet } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import SearchResultsDisplay from './SearchResultsDisplay';
import { useNavigate } from 'react-router-dom';

type SearchFieldProps = {
  isListing?: boolean;
};

function SearchField({ isListing }: SearchFieldProps): JSX.Element {
  const navigate = useNavigate();
  function search(event: FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      navigate('/search/' + searchQuery);
      setSearchQuery('');
      clear();
    }
  }

  function clear() {
    setSearchResults({ results: [], count: 0, next: null, previous: null });
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PaginatedItem<YugiohCardInSet>>({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });

  const debouncedRetrieve = useDebounce(() => {
    yugiohService.searchCardsByName(searchQuery).then(setSearchResults);
  });

  function updateField(event: ChangeEvent) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setSearchQuery(value);
    if (value) {
      debouncedRetrieve();
    } else {
      clear();
    }
  }

  return (
    <ClickAwayListener onClickAway={clear}>
      <form onSubmit={search} className="relative z-50000">
        <TextField
          placeholder={'Type "/" to search'}
          onChange={updateField}
          variant="outlined"
          size="small"
          value={searchQuery}
          InputProps={{
            startAdornment: <SearchButton />,
          }}
        />
        <div>
          <SearchResultsDisplay
            isListing={isListing}
            onClose={clear}
            results={searchResults}
            query={searchQuery}
          />
        </div>
      </form>
    </ClickAwayListener>
  );
}

export default SearchField;
