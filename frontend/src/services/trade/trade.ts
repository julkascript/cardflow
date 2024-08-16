import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { Trade } from './types';

export const tradeService = {
  async findTradeById(id: number): Promise<Trade> {
    const trade = await httpService.get<Trade>(api.trade.id(id));
    return trade!;
  },
};
