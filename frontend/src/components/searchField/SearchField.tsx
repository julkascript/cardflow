import { ClickAwayListener, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import SearchButton from '../navigation/desktop/buttons/SearchButton';
import { useDebounce } from '../../util/useDebounce';
import { YugiohCardSearchResultsDisplay } from '../../services/yugioh/types';
import { retrieveCardsForDisplay } from './retrieveCardsForDisplay/retrieveCardsForDisplay';
import { yugiohService } from '../../services/yugioh/yugiohService';
import SearchResultsDisplay from './SearchResultsDisplay';

function SearchField(): JSX.Element {
  function search(event: FormEvent) {
    event.preventDefault();
    // TO-DO: implement search functionality at a later point
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YugiohCardSearchResultsDisplay>({
    results: [],
    total: 0,
  });

  const debouncedRetrieve = useDebounce(() => {
    yugiohService.searchCardsByName(searchQuery).then((res) => {
      const cards = retrieveCardsForDisplay(res);
      setSearchResults(cards);
    });
  });

  function updateField(event: ChangeEvent) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setSearchQuery(value);
    if (value) {
      debouncedRetrieve();
    } else {
      setSearchResults({ results: [], total: 0 });
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setSearchResults({ total: 0, results: [] })}>
      <form onSubmit={search} className="relative z-0">
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
          <SearchResultsDisplay results={searchResults} query={searchQuery} />
        </div>
      </form>
    </ClickAwayListener>
  );
}

export default SearchField;
