import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { BestSeller } from './types';

export const bestSellerService = {
  async getBestSellers(): Promise<BestSeller[]> {
    const data = await httpService.get<BestSeller[]>(api.bestSeller.root);
    return data!;
  },
};
