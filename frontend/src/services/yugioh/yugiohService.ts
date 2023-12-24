import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { PaginatedItem, YugiohCard, YugiohCardInSet, YugiohCardListing } from './types';

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

  async searchCardsByName(name: string): Promise<YugiohCard[]> {
    const cards = await httpService.get<PaginatedItem<YugiohCard>>(api.yugioh.cards.root, {
      card_name: name,
    });
    return cards!.results;
  },
};
