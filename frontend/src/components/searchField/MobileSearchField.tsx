import { ClickAwayListener, Dialog, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../util/useSearch/useSearch';
import SearchButton from '../navigation/desktop/buttons/SearchButton';
import MobileSearchResultsDisplay from './MobileSearchResultsDisplay';

type MobileSearchFieldProps = {
  open: boolean;
  onClose: () => void;
};

function MobileSearchField(props: MobileSearchFieldProps): JSX.Element {
  const navigate = useNavigate();
  const { searchQuery, searchCards, searchResults, clearResults } = useSearch();
  function search(event: React.FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      navigate('/search/' + searchQuery);
      clearResults();
    }
  }

  function updateField(event: React.ChangeEvent) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    searchCards(value);
  }
  return (
    <Dialog fullWidth open={props.open} onClose={props.onClose} sx={{ bottom: 'auto' }}>
      <ClickAwayListener onClickAway={clearResults}>
        <form onSubmit={search} className="relative z-[50000]">
          <div className="p-2">
            <TextField
              placeholder={'Search'}
              onChange={updateField}
              variant="outlined"
              className="w-full"
              size="small"
              value={searchQuery}
              InputProps={{
                startAdornment: <SearchButton />,
              }}
            />
          </div>
          <div
            className="w-full"
            style={{ visibility: searchResults.results.length ? 'visible' : 'hidden' }}
          >
            <MobileSearchResultsDisplay
              isListing={false}
              onClose={clearResults}
              results={searchResults}
              query={searchQuery}
            />
          </div>
        </form>
      </ClickAwayListener>
    </Dialog>
  );
}

export default MobileSearchField;
