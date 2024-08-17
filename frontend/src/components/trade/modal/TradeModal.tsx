import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import TradeModalSection from './section/TradeModalSection';
import { useTrade } from '../../../context/trade';
import TradeStatusBadge from './section/elements/TradeStatusBadge';
import RequestButton from './section/elements/buttons/RequestButton';
import DeclineButton from './section/elements/buttons/DeclineButton';
import AcceptButton from './section/elements/buttons/AcceptButton';

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
        <DialogTitle className="flex gap-2 items-center">
          {props.id ? <span className="font-bold text-3xl">Offer #TR-{props.id}</span> : ''}
          <TradeStatusBadge />
        </DialogTitle>
        <DialogContent>
          <TradeModalSection user={trade.initiator} />
          <Divider />
          <TradeModalSection user={trade.recipient} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={props.onClose}>
            Close
          </Button>
          <RequestButton onClick={() => {}} />
          <DeclineButton onClick={() => {}} />
          <AcceptButton onClick={() => {}} />
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default TradeModal;
