import { tradeStatusResult, tradeStatusStage } from '../../constants/tradeStatus';

export type TradeRequest = {
  initiator_listing: number[];
  recipient_listing: number[];
  initiator_cash: number;
  recipient_cash: number;
  initiator_decision: tradeStatusResult;
  recipient_decision: tradeStatusResult;
  recipient_id: number;
  initiator_id: number;
};

export type TradeParticipant = {
  id: number;
  username: string;
  email: string | null;
  avatar: string | null;
};

export type Trade = {
  id: number;
  initiator: TradeParticipant;
  recipient: TradeParticipant;
  initiator_listing: number[];
  recipient_listing: number[];
  initiator_cash: number | null;
  recipient_cash: number | null;
  trade_status: tradeStatusStage;
  initiator_decision: tradeStatusResult;
  recipient_decision: tradeStatusResult;
};

export type TradeStatusUpdateResponse = {
  status: tradeStatusStage;
};

type tradeChatMessageType = 'user' | 'system';

export type TradeChatData = {
  created_at: string;
  id: number;
  messages: TradeChatMessage[];
  trade_id: number;
};

export type TradeChatMessage = {
  id: number;
  message: string;
  sender?: number;
  sender_type?: tradeChatMessageType;
  sender_username: string;
  created_at: string;
  event_type: tradeStatusStage;
};

export type SendTradeChatMessage = {
  message: string;
};
