import { tradeStatusResult } from '../../../../../../constants/tradeStatus';

export type TradeModalButtonProps = {
  onClick: () => void;
  otherUserDecision: tradeStatusResult;
};
