import { describe, it, expect, vi } from 'vitest';
import { httpService } from '../http/http';
import { PaginatedItem, YugiohCardInSet, YugiohCardListing } from './types';
import { yugiohService } from './yugiohService';

describe('yugiohService', () => {
  describe('getCardInSetById', () => {
    it('returns data successfully', async () => {
      const sampleCardInSet: YugiohCardInSet = {
        id: 1,
        yugioh_card: {
          id: 1,
          card_name: '',
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
          id: 1,
          card_set_name: '',
          set_code: '',
        },
        rarity: {
          id: 1,
          rarity: '',
          rarity_code: '',
        },
      };

      vi.spyOn(httpService, 'get').mockResolvedValueOnce(sampleCardInSet);

      const result = await yugiohService.getCardInSetById(1);
      expect(result).toEqual(sampleCardInSet);
    });
  });

  describe('getCardListingsByCardSetId', () => {
    it('returns data successfully', async () => {
      const sampleListing: PaginatedItem<YugiohCardListing> = {
        count: 15,
        next: null,
        previous: null,
        results: [],
      };

      vi.spyOn(httpService, 'get').mockResolvedValueOnce(sampleListing);

      const result = await yugiohService.getCardListingsByCardSetId(1, 1);
      expect(result).toEqual(sampleListing);
    });
  });
});
