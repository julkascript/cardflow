import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import TradeModalSection from './section/TradeModalSection';
import { useTrade } from '../../../context/trade';
import TradeStatusBadge from './section/elements/TradeStatusBadge';
import RequestButton from './section/elements/buttons/RequestButton';
import DeclineButton from './section/elements/buttons/DeclineButton';
import AcceptButton from './section/elements/buttons/AcceptButton';
import { useCurrentUser } from '../../../context/user';
import { useTranslation } from 'react-i18next';

type TradeModalProps = {
  open: boolean;
  onClose: () => void;
  id: number;
  onAccept: () => void;
  onReject: () => void;
  onNegotiate: () => void;
};

function TradeModal(props: TradeModalProps): JSX.Element {
  const { trade } = useTrade();
  const { user } = useCurrentUser();

  const { t } = useTranslation('trade');

  const otherUserDecision =
    user.user_id !== trade.initiator.id ? trade.initiator_decision : trade.recipient_decision;

  return (
    <Dialog fullWidth maxWidth="lg" open={props.open} onClose={props.onClose}>
      <div className="p-8">
        <DialogTitle className="flex gap-2 items-center justify-center lg:justify-start">
          {props.id ? (
            <span className="font-bold text-3xl">{t('modal.title', { id: props.id })}</span>
          ) : (
            ''
          )}
          <TradeStatusBadge />
        </DialogTitle>
        <DialogContent>
          <TradeModalSection user={trade.initiator} />
          <Divider />
          <TradeModalSection user={trade.recipient} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={props.onClose}>
            {t('modal.buttons.close')}
          </Button>
          <RequestButton otherUserDecision={otherUserDecision} onClick={props.onNegotiate} />
          <DeclineButton otherUserDecision={otherUserDecision} onClick={props.onReject} />
          <AcceptButton otherUserDecision={otherUserDecision} onClick={props.onAccept} />
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default TradeModal;
