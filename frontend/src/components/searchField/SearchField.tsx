import { ClickAwayListener, TextField } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import SearchButton from '../navigation/desktop/buttons/SearchButton';
import SearchResultsDisplay from './SearchResultsDisplay';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../util/useSearch/useSearch';
import { useTranslation } from 'react-i18next';

type SearchFieldProps = {
  isListing?: boolean;
};

function SearchField({ isListing }: SearchFieldProps): JSX.Element {
  const navigate = useNavigate();
  const { searchQuery, searchCards, searchResults, clearResults } = useSearch();
  const { t } = useTranslation('common');

  function search(event: FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      navigate('/search/' + searchQuery);
      clearResults();
    }
  }

  function updateField(event: ChangeEvent) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    searchCards(value);
  }

  return (
    <ClickAwayListener onClickAway={clearResults}>
      <form onSubmit={search} className="relative">
        <TextField
          placeholder={t('search.placeholder')}
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
            onClose={clearResults}
            results={searchResults}
            query={searchQuery}
          />
        </div>
      </form>
    </ClickAwayListener>
  );
}

export default SearchField;
