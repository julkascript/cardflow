import { describe, it, expect, vi } from 'vitest';
import { loadSearchResults } from './loadSearchResults';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { PaginatedItem, YugiohCardInSet } from '../../services/yugioh/types';

describe('loadSearchResults', () => {
  it('Returns an object with an empty array if the query is invalid', async () => {
    const emptyResult: PaginatedItem<YugiohCardInSet> = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
    const result = await loadSearchResults({ params: { query: '' } });
    expect(result).toEqual({ cards: emptyResult });
  });

  it('Returns data successfully', async () => {
    const sampleCard: YugiohCardInSet = {
      id: 1,
      yugioh_card: {
        id: 1,
        card_name: 'test',
        type: '',
        frame_type: '',
        description: '',
        attack: '',
        defense: '',
        level: '',
        race: '',
        attribute: '',
        archetype: '',
        image: '',
      },
      set: {
        id: 0,
        card_set_name: '',
        set_code: '',
      },
      rarity: {
        id: 0,
        rarity: '',
        rarity_code: '',
      },
    };

    const sampleResult: PaginatedItem<YugiohCardInSet> = {
      count: 0,
      next: null,
      previous: null,
      results: [sampleCard],
    };

    vi.spyOn(yugiohService, 'searchCardsByName').mockResolvedValueOnce(sampleResult);

    const result = await loadSearchResults({ params: { query: 'test' } });
    expect(result).toEqual({ cards: sampleResult });
  });
});
