import { describe, expect, it } from 'vitest';
import { YugiohCard, YugiohCardSet } from '../../../services/yugioh/types';
import { retrieveCardsForDisplay } from './retrieveCardsForDisplay';
import { searchRules } from '../../../constants/searchRules';

function generateCard(setCount: number, startIndex: number): YugiohCard {
  const card: YugiohCard = {
    id: startIndex,
    card_name: setCount.toString(),
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
  for (let i = 0; i < setCount; i++) {
    const set: YugiohCardSet = {
      card_in_set_id: startIndex,
      set: {
        id: startIndex,
        card_set_name: '',
        set_code: '',
      },
      rarity: {
        id: startIndex,
        rarity: '',
        rarity_code: '',
      },
    };

    card.card_in_sets.push(set);
    startIndex++;
  }

  return card;
}

describe('retrieveCardsForDisplay', () => {
  it('Works with an empty collection', () => {
    const results = retrieveCardsForDisplay([]);
    expect(results.results).toEqual([]);
    expect(results.total).toBe(0);
  });

  it('Works if the first card has enough sets on its own', () => {
    const card1 = generateCard(searchRules.maxSearchFieldDisplayResults, 1);
    const card2 = generateCard(1, searchRules.maxSearchFieldDisplayResults + 1);

    const result = retrieveCardsForDisplay([card1, card2]);
    expect(result.total).toBe(searchRules.maxSearchFieldDisplayResults + 1);
    expect(result.results.length).toBe(searchRules.maxSearchFieldDisplayResults);
  });

  it('Works if a card does not have enough sets on its own, but the next one does', () => {
    const card1 = generateCard(2, 1);
    const card2 = generateCard(1, 3);
    const card3 = generateCard(1, 4);

    const result = retrieveCardsForDisplay([card1, card2, card3]);
    expect(result.total).toBe(4);
    expect(result.results.length).toBe(4);
  });

  it('Works if there are less than four sets in the entire collection', () => {
    const card1 = generateCard(1, 1);
    const card2 = generateCard(1, 2);
    const card3 = generateCard(1, 3);

    const result = retrieveCardsForDisplay([card1, card2, card3]);
    expect(result.total).toBe(3);
    expect(result.results.length).toBe(3);
  });

  it('Works with the limit off', () => {
    const card1 = generateCard(searchRules.maxSearchFieldDisplayResults + 1, 1);
    const result = retrieveCardsForDisplay([card1], false);
    expect(result.results.length).toBe(searchRules.maxSearchFieldDisplayResults + 1);
  });
});
