import { Divider, IconButton } from '@mui/material';
import { useTrade } from '../../../context/trade';
import PageSection from '../../PageSection';
import ExpandIcon from '@mui/icons-material/Fullscreen';
import TradePreviewSide from './previewElements/TradePreviewSide';
import TradePreviewRejectButton from './previewElements/previewButtons/TradePreviewRejectButton';
import TradePreviewExpandButton from './previewElements/previewButtons/TradePreviewExpandButton';
import TradePreviewAcceptButton from './previewElements/previewButtons/TradePreviewAcceptButton';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../../context/user';

type TradePreviewProps = {
  onReject: () => void;
  onAccept: () => void;
};

function TradePreview(props: TradePreviewProps): JSX.Element {
  const { trade, setModalIsOpen } = useTrade();
  const { t } = useTranslation('trade');

  const { user } = useCurrentUser();

  const decision =
    user.user_id === trade.initiator.id ? trade.initiator_decision : trade.recipient_decision;

  return (
    <PageSection className="w-5/6 sm:w-1/2 lg:w-1/4 p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">{t('details.preview.currentOffer')}</h3>
        <IconButton onClick={() => setModalIsOpen(true)} color="info">
          <ExpandIcon />
        </IconButton>
      </div>
      <TradePreviewSide
        user={trade.initiator}
        listings={trade.initiator_listing}
        cash={trade.initiator_cash || 0}
        decision={trade.initiator_decision}
      />
      <Divider />
      <TradePreviewSide
        user={trade.recipient}
        listings={trade.recipient_listing}
        cash={trade.recipient_cash || 0}
        decision={trade.recipient_decision}
      />
      <Divider />
      <div className="flex gap-2 justify-center items-center flex-col sm:flex-row lg:flex-row my-6">
        <TradePreviewRejectButton decision={decision} onClick={props.onReject} />
        <TradePreviewExpandButton />
        <TradePreviewAcceptButton decision={decision} onClick={props.onAccept} />
      </div>
    </PageSection>
  );
}

export default TradePreview;
