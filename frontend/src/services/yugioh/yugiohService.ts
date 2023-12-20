import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { PaginatedItem, YugiohCardInSet, YugiohCardListing } from './types';

export const yugiohService = {
  async getCardInSetById(id: number): Promise<YugiohCardInSet> {
    const card = await httpService.get<YugiohCardInSet>(api.yugioh.cardInSet.id(id));
    return card!;
  },

  async getCardListingsByCardSetId(
    id: number,
    page?: number,
  ): Promise<PaginatedItem<YugiohCardListing>> {
    const listings = await httpService.get<PaginatedItem<YugiohCardListing>>(
      api.yugioh.listing.root,
      {
        is_sold: false,
        is_listed: true,
        page,
        card_set_id: id, // TO-DO: change query if backend uses something else
      },
    );

    return listings!;
  },
};
