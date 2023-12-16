import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { YugiohCardInSet, YugiohCard } from './types';

export const yugiohService = {
  async getCardInSetById(id: number): Promise<YugiohCardInSet> {
    const card = await httpService.get<YugiohCardInSet>(api.yugioh.cardInSet.id(id));
    return card!;
  },

  async searchCardsByName(name: string): Promise<YugiohCard[]> {
    const cards = await httpService.get<YugiohCard[]>(api.yugioh.cards.root, {
      card_name: name,
    });

    return cards!;
  },
};
