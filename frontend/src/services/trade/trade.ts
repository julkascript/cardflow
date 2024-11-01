import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { PaginatedItem } from '../yugioh/types';
import {
  SendTradeChatMessage,
  Trade,
  TradeChatData,
  TradeChatMessage,
  TradeRequest,
  TradeStatusUpdateResponse,
} from './types';

export const tradeService = {
  async findTradeById(id: number): Promise<Trade> {
    const trade = await httpService.get<Trade>(api.trade.id(id));
    return trade!;
  },

  async getTrades(page = 1): Promise<PaginatedItem<Trade>> {
    const trades = await httpService.get<PaginatedItem<Trade>>(api.trade.root, { page });
    return trades!;
  },

  async initiate(currentUserId: number, userId: number): Promise<Trade> {
    const trade: Partial<TradeRequest> = {
      initiator_listing: [],
      recipient_listing: [],
      initiator_cash: 0,
      recipient_cash: 0,
      recipient_id: userId,
      initiator_id: currentUserId,
    };

    const data = await httpService.post<Trade>(api.trade.root, trade);

    return data!;
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

  async sendMessage(tradeId: number, message: SendTradeChatMessage): Promise<TradeChatMessage> {
    const data = await httpService.post<TradeChatMessage>(
      api.trade.chat.byTradeId(tradeId),
      message,
    );
    return data!;
  },

  async retrieveTradeChatMessages(tradeId: number): Promise<TradeChatData> {
    const data = await httpService.get<TradeChatData>(api.trade.chat.byTradeId(tradeId));
    return data!;
  },
};
