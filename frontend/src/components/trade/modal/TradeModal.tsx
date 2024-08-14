import { Trade } from '../../../services/trade/types';

type TradeModalProps = {
  trade: Trade;
  open: boolean;
  onClose: () => void;
};

function TradeModal(props: TradeModalProps): JSX.Element {
  return <div></div>;
}

export default TradeModal;
