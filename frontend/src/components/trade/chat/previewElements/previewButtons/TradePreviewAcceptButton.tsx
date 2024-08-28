import { Button, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

type TradePreviewAcceptButtonProps = {
  onClick: () => void;
};

function TradePreviewAcceptButton(props: TradePreviewAcceptButtonProps): JSX.Element {
  const { t } = useTranslation('trade');

  return (
    <Tooltip title={t('details.preview.buttons.accept')}>
      <Button onClick={props.onClick} color="success" variant="outlined">
        <CheckIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewAcceptButton;
