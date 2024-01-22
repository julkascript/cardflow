import { Params } from 'react-router-dom';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { ListingDetailsLoaderData } from '../../services/yugioh/types';

/**
 * A loader for the card details page.
 * @throws an ``Error`` when the ``id`` route parameter is zero,
 * a negative number, a non-numeric value, or a non-integer number.
 */
export async function loadListingDetails({
  params,
}: {
  params: Params;
}): Promise<ListingDetailsLoaderData> {
  const id = Number(params.id) || 0;
  if (id <= 0 || !Number.isInteger(id)) {
    throw new Error('invalid ID');
  }

  const listings = await yugiohService.getCardListingsByCardSetId(id);

  return { cardListings: listings };
}
