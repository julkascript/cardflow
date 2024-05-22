import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as useDebounce from '../useDebounce';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useSearch } from './useSearch';
import { YugiohCardInSet } from '../../services/yugioh/types';

describe('useSearch', () => {
  const useDebounceSpy = vi.spyOn(useDebounce, 'useDebounce');
  const cards: YugiohCardInSet[] = [
    {
      id: 33396948,
      yugioh_card: {
        id: 33396948,
        card_name: 'Exodia the Forbidden One',
        type: 'Effect Monster',
        frame_type: 'effect',
        description:
          'If you have "Right Leg of the Forbidden One", "Left Leg of the Forbidden One", "Right Arm of the Forbidden One" and "Left Arm of the Forbidden One" in addition to this card in your hand, you win the Duel.',
        attack: '1000',
        defense: '1000',
        level: '3',
        race: 'Spellcaster',
        attribute: 'DARK',
        archetype: 'Exodia',
        image: '',
      },
      set: {
        id: 1,
        card_set_name: 'a',
        set_code: 'a',
      },
      rarity: {
        id: 1,
        rarity: '1',
        rarity_code: '1',
      },
    },
  ];

  beforeEach(() => {
    useDebounceSpy.mockImplementation((callback) => callback);
  });

  it('Correctly handles a successful retrieval of cards', async () => {
    const search = renderHook(() => useSearch()).result;

    vi.spyOn(yugiohService, 'searchCardsByName').mockResolvedValueOnce({
      count: 10,
      next: null,
      previous: null,
      results: cards,
    });

    act(() => search.current.searchCards('Exodia'));

    await waitFor(() => {
      expect(search.current.searchQuery).toBe('Exodia');
      expect(search.current.searchResults.results).toEqual(cards);
    });
  });

  it('Correctly handles a search of cards with an empty string', async () => {
    const search = renderHook(() => useSearch()).result;

    const serviceSpy = vi.spyOn(yugiohService, 'searchCardsByName');

    act(() => search.current.searchCards(''));

    expect(search.current.searchQuery).toBe('');
    expect(search.current.searchResults.results).toEqual([]);
    expect(serviceSpy).not.toHaveBeenCalled();
  });

  it('Correctly clears the search data when explicitly requested', async () => {
    const search = renderHook(() => useSearch()).result;

    vi.spyOn(yugiohService, 'searchCardsByName').mockResolvedValueOnce({
      count: 10,
      next: null,
      previous: null,
      results: cards,
    });

    act(() => search.current.searchCards(''));

    await waitFor(() => {
      search.current.clearResults();
      expect(search.current.searchQuery).toBe('');
      expect(search.current.searchResults.results).toEqual([]);
    });
  });

  afterEach(() => {
    useDebounceSpy.mockClear();
  });
});
