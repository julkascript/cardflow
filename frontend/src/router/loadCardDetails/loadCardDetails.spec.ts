import { describe, it, expect, vi } from 'vitest';
import { loadCardDetails } from './loadCardDetails';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { YugiohCardInSet } from '../../services/yugioh/types';

describe('loadCardDetails', () => {
  it('Throws an error if the ID is invalid', async () => {
    const paramsWithZeroId = { id: '0' };
    const paramsWithNegativeNumberId = { id: '-1' };
    const paramsWithANaN = { id: 'not a number' };
    const paramsWithANonInteger = { id: '2.5' };

    expect(() => loadCardDetails({ params: paramsWithZeroId })).rejects.toThrow(Error);
    expect(() => loadCardDetails({ params: paramsWithNegativeNumberId })).rejects.toThrow(Error);
    expect(() => loadCardDetails({ params: paramsWithANaN })).rejects.toThrow(Error);
    expect(() => loadCardDetails({ params: paramsWithANonInteger })).rejects.toThrow(Error);
  });

  it('Returns whatever is returned from the HTTP requests', async () => {
    const sampleCardInSet: YugiohCardInSet = {
      id: 1,
      yugioh_card: {
        id: 37,
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

    vi.spyOn(yugiohService, 'getCardInSetById').mockResolvedValueOnce(sampleCardInSet);

    const result = await loadCardDetails({ params: { id: '1' } });
    expect(result).toEqual({ cardInSet: sampleCardInSet });
  });
});
