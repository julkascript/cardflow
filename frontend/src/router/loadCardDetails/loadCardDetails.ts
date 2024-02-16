import { Params } from 'react-router-dom';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { CardDetailsLoaderData } from '../../services/yugioh/types';

/**
 * A loader for the card details page.
 * @throws an ``Error`` when the ``id`` route parameter is zero,
 * a negative number, a non-numeric value, or a non-integer number.
 */
export async function loadCardDetails({
  params,
}: {
  params: Params;
}): Promise<CardDetailsLoaderData> {
  const id = Number(params.cardid) || Number(params.id) || 0;
  if (id <= 0 || !Number.isInteger(id)) {
    throw new Error('invalid ID');
  }

  const listings = await yugiohService.getCardListingsByCardSetId(id);
  const cardInSet = await yugiohService.getCardInSetById(id);

  return { cardInSet, cardListings: listings };
}
