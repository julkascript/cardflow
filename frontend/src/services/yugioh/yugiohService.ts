import { api } from '../../constants/api';
import { httpService } from '../http/http';
import {
  BuyYugiohCardListing,
  PaginatedItem,
  YugiohCardInSet,
  YugiohCardListing,
  YugiohCardSellListing,
} from './types';

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

  async getCardListingsByUserId(id: number, page = 1): Promise<PaginatedItem<YugiohCardListing>> {
    const listings = await httpService.get<PaginatedItem<YugiohCardListing>>(
      api.yugioh.listing.root,
      {
        page,
        user_id: id,
      },
    );

    return listings!;
  },

  async buyCardListing(id: number, listing: BuyYugiohCardListing): Promise<YugiohCardListing> {
    const data = await httpService.put<YugiohCardListing>(api.yugioh.listing.buyById(id), listing);
    return data!;
  },

  async sellCardListing(listing: YugiohCardSellListing): Promise<YugiohCardListing> {
    const data = await httpService.post<YugiohCardListing>(
      api.yugioh.listing.sellListing(),
      listing,
    );
    return data!;
  },

  async updateCardListing(
    listing: Partial<YugiohCardSellListing>,
    id: number,
  ): Promise<YugiohCardListing> {
    const data = await httpService.patch<YugiohCardListing>(api.yugioh.listing.id(id), listing);
    return data!;
  },

  async searchCardsByName(name: string, page?: number): Promise<PaginatedItem<YugiohCardInSet>> {
    const cards = await httpService.get<PaginatedItem<YugiohCardInSet>>(api.yugioh.cardInSet.root, {
      card_name: name,
      page: page || 1,
    });

    return cards!;
  },

  async editListing(listing: YugiohCardListing): Promise<YugiohCardListing> {
    const result = await httpService.put<YugiohCardListing>(
      api.yugioh.listing.id(listing.id),
      listing,
    );
    return result!;
  },

  async getListingById(id: number): Promise<YugiohCardListing> {
    const listing = await httpService.get<YugiohCardListing>(api.yugioh.listing.id(id));
    return listing!;
  },

  async deleteListingById(id: number): Promise<void> {
    await httpService.del(api.yugioh.listing.id(id));
  },

  async searchYugiohListingsByCardNameAndUserId(
    cardName: string,
    userId: number,
  ): Promise<PaginatedItem<YugiohCardListing>> {
    const listings = await httpService.get<PaginatedItem<YugiohCardListing>>(
      api.yugioh.listing.root,
      {
        user_id: userId,
        card_name: cardName,
      },
    );

    return listings!;
  },
};
