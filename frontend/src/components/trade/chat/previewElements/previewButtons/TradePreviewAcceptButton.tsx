import { Button, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { tradeService } from '../../../../../services/trade/trade';
import { useTrade } from '../../../../../context/trade';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../../util/useToast';
import { toastMessages } from '../../../../../constants/toast';

function TradePreviewAcceptButton(): JSX.Element {
  const { trade } = useTrade();
  const { t } = useTranslation('trade');
  const toast = useToast();

  function accept() {
    tradeService
      .accept(trade.id)
      .then((t) => {
        if (t.status === 'accepted') {
          toast.success({ toastKey: toastMessages.tradeHasBeenAccepted, values: { id: trade.id } });
        }
      })
      .catch(toast.error);
  }

  return (
    <Tooltip title={t('details.preview.buttons.accept')}>
      <Button onClick={accept} color="success" variant="outlined">
        <CheckIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewAcceptButton;
