import { Button, Tooltip } from '@mui/material';
import RejectIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

type TradePreviewRejectButtonProps = {
  onClick: () => void;
};

function TradePreviewRejectButton(props: TradePreviewRejectButtonProps): JSX.Element {
  const { t } = useTranslation('trade');

  return (
    <Tooltip title={t('details.preview.buttons.reject')}>
      <Button
        sx={{ width: 64, height: 64 }}
        onClick={props.onClick}
        color="error"
        variant="outlined"
      >
        <RejectIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewRejectButton;
