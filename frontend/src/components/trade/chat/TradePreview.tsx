import { Divider, IconButton } from '@mui/material';
import { useTrade } from '../../../context/trade';
import PageSection from '../../PageSection';
import ExpandIcon from '@mui/icons-material/Fullscreen';
import TradePreviewSide from './previewElements/TradePreviewSide';
import TradePreviewRejectButton from './previewElements/previewButtons/TradePreviewRejectButton';
import TradePreviewExpandButton from './previewElements/previewButtons/TradePreviewExpandButton';
import TradePreviewAcceptButton from './previewElements/previewButtons/TradePreviewAcceptButton';
import { useTranslation } from 'react-i18next';

type TradePreviewProps = {
  onReject: () => void;
  onAccept: () => void;
};

function TradePreview(props: TradePreviewProps): JSX.Element {
  const { trade, setModalIsOpen } = useTrade();
  const { t } = useTranslation('trade');

  return (
    <PageSection className="w-1/5 p-4">
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
      <div className="flex gap-2 justify-center flex-col lg:flex-row my-6">
        <TradePreviewRejectButton onClick={props.onReject} />
        <TradePreviewExpandButton />
        <TradePreviewAcceptButton onClick={props.onAccept} />
      </div>
    </PageSection>
  );
}

export default TradePreview;
