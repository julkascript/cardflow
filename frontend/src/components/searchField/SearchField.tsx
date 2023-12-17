import { ClickAwayListener, TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import SearchButton from '../navigation/desktop/buttons/SearchButton';
import { useDebounce } from '../../util/useDebounce';
import { YugiohCardSearchResultsDisplay } from '../../services/yugioh/types';
import { retrieveCardsForDisplay } from './retrieveCardsForDisplay/retrieveCardsForDisplay';
import { yugiohService } from '../../services/yugioh/yugiohService';
import SearchResultsDisplay from './SearchResultsDisplay';
import { useNavigate } from 'react-router-dom';

function SearchField(): JSX.Element {
  const navigate = useNavigate();
  function search(event: FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      navigate('/search/' + searchQuery);
      setSearchQuery('');
      setSearchResults({ results: [], total: 0 });
    }
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
          <SearchResultsDisplay results={searchResults} query={searchQuery} />
        </div>
      </form>
    </ClickAwayListener>
  );
}

export default SearchField;
