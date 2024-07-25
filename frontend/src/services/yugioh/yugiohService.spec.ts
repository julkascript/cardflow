import { describe, it, expect, vi } from 'vitest';
import { httpService } from '../http/http';
import { BuyYugiohCardListing, PaginatedItem, YugiohCardInSet, YugiohCardListing } from './types';
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

  describe('searchCardsByName', () => {
    it('returns data successfully', async () => {
      const testCard: YugiohCardInSet = {
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
      const sampleCards: PaginatedItem<YugiohCardInSet> = {
        count: 0,
        next: null,
        previous: null,
        results: [testCard],
      };

      vi.spyOn(httpService, 'get').mockResolvedValueOnce(sampleCards);

      const result = await yugiohService.searchCardsByName('test');
      expect(result).toEqual(sampleCards);
    });
  });

  describe('buyCardListing', () => {
    it('returns data successfully', async () => {
      const sampleBuyListing: BuyYugiohCardListing = {
        card: 3,
        price: 2,
        condition: 'excellent',
        is_listed: true,
        is_sold: false,
      };

      const sampleListing: YugiohCardListing = {
        is_trade_considered: false,
        id: 1,
        card: 3,
        card_name: 'test',
        card_set_id: 1,
        user: 1,
        user_name: 'test',
        price: 2,
        condition: 'excellent',
        quantity: 0,
        is_listed: true,
        is_sold: false,
        card_in_set: {
          id: 0,
          yugioh_card: {
            id: 0,
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
            id: 0,
            card_set_name: '',
            set_code: '',
          },
          rarity: {
            id: 0,
            rarity: '',
            rarity_code: '',
          },
        },
      };

      vi.spyOn(httpService, 'put').mockResolvedValueOnce(sampleListing);

      const result = await yugiohService.buyCardListing(1, sampleBuyListing);
      expect(result).toEqual(sampleListing);
    });
  });
});
