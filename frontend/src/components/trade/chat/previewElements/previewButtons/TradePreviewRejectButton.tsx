import { Button, Tooltip } from '@mui/material';
import RejectIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';
import { tradeStatusResult } from '../../../../../constants/tradeStatus';
import { useTrade } from '../../../../../context/trade';

type TradePreviewRejectButtonProps = {
  onClick: () => void;
  decision: tradeStatusResult;
};

function TradePreviewRejectButton(props: TradePreviewRejectButtonProps): JSX.Element {
  const { t } = useTranslation('trade');
  const { trade } = useTrade();

  const hasRejected = props.decision === 'reject';

  return (
    <Tooltip title={t('details.preview.buttons.reject')}>
      <Button
        sx={{ width: 64, height: 64 }}
        onClick={props.onClick}
        color="error"
        variant={hasRejected ? 'contained' : 'outlined'}
        disabled={trade.trade_status !== 'negotiate'}
      >
        <RejectIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewRejectButton;
