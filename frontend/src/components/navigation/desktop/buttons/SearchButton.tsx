import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * A search icon button, intended to be placed at the beginning
 * of a search field.
 * @returns
 */
function SearchButton(): JSX.Element {
  return (
    <InputAdornment position="start">
      <IconButton aria-label="Search" size="small">
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  );
}

export default SearchButton;
