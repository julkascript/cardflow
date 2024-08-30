import { Button, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { tradeStatusResult } from '../../../../../constants/tradeStatus';
import { useTrade } from '../../../../../context/trade';

type TradePreviewAcceptButtonProps = {
  onClick: () => void;
  decision: tradeStatusResult;
};

function TradePreviewAcceptButton(props: TradePreviewAcceptButtonProps): JSX.Element {
  const { t } = useTranslation('trade');
  const { trade } = useTrade();

  const hasAccepted = props.decision === 'accept';

  return (
    <Tooltip title={t('details.preview.buttons.accept')}>
      <Button
        sx={{
          width: 64,
          height: 64,
          color: hasAccepted ? 'white' : undefined,
          ':hover': {
            color: hasAccepted ? 'black' : undefined,
          },
        }}
        onClick={props.onClick}
        color="success"
        variant={hasAccepted ? 'contained' : 'outlined'}
        disabled={trade.trade_status !== 'negotiate'}
      >
        <CheckIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewAcceptButton;
