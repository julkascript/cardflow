import { TextField } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import SearchButton from '../navigation/desktop/buttons/SearchButton';

function SearchField(): JSX.Element {
  function search(event: FormEvent) {
    event.preventDefault();
    // TO-DO: implement search functionality at a later point
  }

  const [searchQuery, setSearchQuery] = useState('');

  function updateField(event: ChangeEvent) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setSearchQuery(value);
  }

  return (
    <form onSubmit={search}>
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
    </form>
  );
}

export default SearchField;
