import { describe, it, expect, vi } from 'vitest';
import { loadSearchResults } from './loadSearchResults';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { YugiohCard } from '../../services/yugioh/types';

describe('loadSearchResults', () => {
  it('Returns an object with an empty array if the query is invalid', async () => {
    const result = await loadSearchResults({ params: { query: '' } });
    expect(result).toEqual({ cards: [] });
  });

  it('Returns data successfully', async () => {
    const sampleCard: YugiohCard = {
      id: 2,
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
      card_in_sets: [],
    };
    vi.spyOn(yugiohService, 'searchCardsByName').mockResolvedValueOnce([sampleCard]);

    const result = await loadSearchResults({ params: { query: 'test' } });
    expect(result).toEqual({ cards: [sampleCard] });
  });
});
