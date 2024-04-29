import { Params } from 'react-router-dom';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { EditListingLoaderData } from '../../services/yugioh/types';
import { authorizedGuard } from '../authorizedGuard/authorizedGuard';

/**
 * A loader for the edit listing page. Provides you with the given listing's
 * details, as well as market information about listings of the same card.
 * @throws an ``Error`` when the ``id`` route parameter is zero,
 * a negative number, a non-numeric value, or a non-integer number.
 */
export async function loadListingForEdit({
  params,
}: {
  params: Params;
}): Promise<EditListingLoaderData | Response> {
  const id = Number(params.cardid) || Number(params.id) || 0;
  if (id <= 0 || !Number.isInteger(id)) {
    throw new Error('invalid ID');
  }

  const authorizedRes = await authorizedGuard();
  if (authorizedRes !== null) {
    return authorizedRes;
  }

  const listing = await yugiohService.getListingById(id);
  const listings = await yugiohService.getCardListingsByCardSetId(listing.card_set_id);

  return { listing, listings };
}
