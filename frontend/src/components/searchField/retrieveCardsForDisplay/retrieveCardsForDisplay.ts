import { searchRules } from '../../../constants/searchRules';
import {
  YugiohCard,
  YugiohCardSearchResults,
  YugiohCardSearchResultsDisplay,
  YugiohCardSet,
} from '../../../services/yugioh/types';

/**
 * retrieves a limited or a full amount of card sets to display to the user after
 * they finish typing in the search field or when they execute a search in the search page.
 * @param cards
 * @param limit whether to retrieve a limited amount or retrieve everything.
 * The total amount will be counted no matter what. Defaults to ``true``.
 * @returns
 */
export function retrieveCardsForDisplay(
  cards: YugiohCard[],
  limit = true,
): YugiohCardSearchResultsDisplay {
  let count = 0;
  const results: YugiohCardSearchResults[] = [];
  for (const card of cards) {
    for (const c of card.card_in_sets) {
      if (limit) {
        if (count < searchRules.maxSearchFieldDisplayResults) {
          const result = constructResult(c, card.card_name);

          results.push(result);
        }
      } else {
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
