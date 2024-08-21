import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { Trade, TradeRequest, TradeStatusUpdateResponse } from './types';

export const tradeService = {
  async findTradeById(id: number): Promise<Trade> {
    const trade = await httpService.get<Trade>(api.trade.id(id));
    return trade!;
  },

  async negotiate(tradeId: number, trade: Partial<TradeRequest>): Promise<Trade> {
    const data = await httpService.post<Trade>(api.trade.negotiate(tradeId), trade);
    return data!;
  },

  async counterOffer(tradeId: number, trade: Partial<TradeRequest>): Promise<Trade> {
    const data = await httpService.post<Trade>(api.trade.counterOffer(tradeId), trade);
    return data!;
  },

  async accept(tradeId: number): Promise<TradeStatusUpdateResponse> {
    const data = await httpService.post<TradeStatusUpdateResponse>(api.trade.accept(tradeId));
    return data!;
  },

  async reject(tradeId: number): Promise<TradeStatusUpdateResponse> {
    const data = await httpService.post<TradeStatusUpdateResponse>(api.trade.reject(tradeId));
    return data!;
  },
};
