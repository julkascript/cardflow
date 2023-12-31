import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { BuyYugiohCardListing, PaginatedItem, YugiohCardInSet, YugiohCardListing } from './types';

export const yugiohService = {
  async getCardInSetById(id: number): Promise<YugiohCardInSet> {
    const card = await httpService.get<YugiohCardInSet>(api.yugioh.cardInSet.id(id));
    return card!;
  },

  async getCardListingsByCardSetId(
    id: number,
    page?: number,
  ): Promise<PaginatedItem<YugiohCardListing>> {
    const query: any = {
      is_sold: false,
      is_listed: true,
      card_in_set_id: id,
    };

    if (page) {
      query.page = page;
    }

    const listings = await httpService.get<PaginatedItem<YugiohCardListing>>(
      api.yugioh.listing.root,
      query,
    );

    return listings!;
  },

  async buyCardListing(id: number, listing: BuyYugiohCardListing): Promise<YugiohCardListing> {
    const data = await httpService.put<YugiohCardListing>(api.yugioh.listing.buyById(id), listing);
    return data!;
  },

  async searchCardsByName(name: string, page?: number): Promise<PaginatedItem<YugiohCardInSet>> {
    const cards = await httpService.get<PaginatedItem<YugiohCardInSet>>(api.yugioh.cardInSet.root, {
      card_name: name,
      page: page || 1,
    });

    return cards!;
  },
};
