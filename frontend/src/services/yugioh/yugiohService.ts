import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { YugiohCardInSet } from './types';

export const yugiohService = {
  async getCardInSetById(id: number): Promise<YugiohCardInSet> {
    const card = await httpService.get<YugiohCardInSet>(api.yugioh.cardInSet.id(id));
    return card!;
  },
};
