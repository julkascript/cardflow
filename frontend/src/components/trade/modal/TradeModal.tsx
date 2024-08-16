import { Dialog } from '@mui/material';
import TradeModalSection from './section/TradeModalSection';
import { useTrade } from '../../../context/trade';

type TradeModalProps = {
  open: boolean;
  onClose: () => void;
};

function TradeModal(props: TradeModalProps): JSX.Element {
  const { trade } = useTrade();
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <TradeModalSection user={trade.initiator} />
      <TradeModalSection user={trade.recipient} />
    </Dialog>
  );
}

export default TradeModal;
