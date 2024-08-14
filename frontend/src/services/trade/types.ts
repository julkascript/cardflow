import { tradeStatusResult, tradeStatusStage } from '../../constants/tradeStatus';

export type TradeRequest = {
  initiator_listing: number[];
  recipient_listing: number[];
  initiator_cash: number;
  recipient_cash: number;
  initiator_decision: tradeStatusResult;
  recipient_decision: tradeStatusResult;
  recipient_id: number;
};

export type TradeParticipant = {
  id: number;
  username: string;
  email?: string;
};

export type Trade = {
  id: number;
  initiator: TradeParticipant;
  recipient: TradeParticipant;
  initiator_listing: number[];
  recipient_listing: number[];
  initiator_cash?: number;
  recipient_cash?: number;
  trade_status: tradeStatusStage;
  initiator_decision: tradeStatusResult;
  recipient_decision: tradeStatusResult;
};
