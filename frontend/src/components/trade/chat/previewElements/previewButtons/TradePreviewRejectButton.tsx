import { Button, Tooltip } from '@mui/material';
import RejectIcon from '@mui/icons-material/Clear';
import { tradeService } from '../../../../../services/trade/trade';
import { useTrade } from '../../../../../context/trade';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../../util/useToast';
import { toastMessages } from '../../../../../constants/toast';

function TradePreviewRejectButton(): JSX.Element {
  const { trade } = useTrade();
  const { t } = useTranslation('trade');
  const toast = useToast();

  function reject() {
    tradeService
      .reject(trade.id)
      .then((t) => {
        if (t.status === 'rejected') {
          toast.success({ toastKey: toastMessages.tradeHasBeenRejected, values: { id: trade.id } });
        }
      })
      .catch(toast.error);
  }

  return (
    <Tooltip title={t('details.preview.buttons.reject')}>
      <Button onClick={reject} color="error" variant="outlined">
        <RejectIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewRejectButton;
