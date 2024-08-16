import { Dialog, Divider } from '@mui/material';
import TradeModalSection from './section/TradeModalSection';
import { useTrade } from '../../../context/trade';

type TradeModalProps = {
  open: boolean;
  onClose: () => void;
  id?: number;
};

function TradeModal(props: TradeModalProps): JSX.Element {
  const { trade } = useTrade();
  return (
    <Dialog fullWidth maxWidth="lg" open={props.open} onClose={props.onClose}>
      <div className="p-8">
        {props.id ? <h2 className="font-bold text-3xl">Offer #TR-{props.id}</h2> : ''}
        <TradeModalSection user={trade.initiator} />
        <Divider />
        <TradeModalSection user={trade.recipient} />
      </div>
    </Dialog>
  );
}

export default TradeModal;
