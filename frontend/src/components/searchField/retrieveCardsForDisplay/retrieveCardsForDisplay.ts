import { searchRules } from '../../../constants/searchRules';
import {
  YugiohCard,
  YugiohCardSearchResults,
  YugiohCardSearchResultsDisplay,
  YugiohCardSet,
} from '../../../services/yugioh/types';

/**
 * retrieves a limited amount of card sets to display to the user after
 * they finish typing in the search field.
 * @param cards
 * @returns
 */
export function retrieveCardsForDisplay(cards: YugiohCard[]): YugiohCardSearchResultsDisplay {
  let count = 0;
  const results: YugiohCardSearchResults[] = [];
  for (const card of cards) {
    for (const c of card.card_in_sets) {
      if (count < searchRules.maxSearchFieldDisplayResults) {
        const result = constructResult(c, card.card_name);

        results.push(result);
      }

      count++;
    }
  }

  return { results, total: count };
}

function constructResult(card: YugiohCardSet, cardName: string): YugiohCardSearchResults {
  const result: YugiohCardSearchResults = {
    cardName,
    card: {
      card_in_set_id: card.card_in_set_id,
      set: {
        id: card.set.id,
        card_set_name: card.set.card_set_name,
        set_code: card.set.set_code,
      },
      rarity: {
        id: card.rarity.id,
        rarity: card.rarity.rarity,
        rarity_code: card.rarity.rarity_code,
      },
    },
  };

  return result;
}
