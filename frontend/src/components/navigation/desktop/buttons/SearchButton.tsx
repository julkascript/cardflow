import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

/**
 * A search icon button, intended to be placed at the beginning
 * of a search field.
 * @returns
 */
function SearchButton(): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <InputAdornment position="start">
      <IconButton type="submit" aria-label={t('search.search')} size="small">
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  );
}

export default SearchButton;
