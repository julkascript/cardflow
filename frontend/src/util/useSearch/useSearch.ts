import { useState } from 'react';
import { PaginatedItem, YugiohCardInSet } from '../../services/yugioh/types';
import { useDebounce } from '../useDebounce';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useToast } from '../useToast';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();
  const [searchResults, setSearchResults] = useState<PaginatedItem<YugiohCardInSet>>({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });

  const debouncedRetrieve = useDebounce(() => {
    yugiohService
      .searchCardsByName(searchQuery)
      .then(setSearchResults)
      .catch((error) => toast.error({ error }));
  });

  function clearResults() {
    setSearchResults({ results: [], count: 0, next: null, previous: null });
  }

  function searchCards(query: string): void {
    setSearchQuery(query);
    if (!query) {
      return clearResults();
    }

    debouncedRetrieve();
  }

  return { searchResults, searchQuery, clearResults, searchCards };
};
