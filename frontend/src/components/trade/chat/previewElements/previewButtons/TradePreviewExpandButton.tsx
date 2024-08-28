import { Button, Tooltip } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTrade } from '../../../../../context/trade';
import { useTranslation } from 'react-i18next';

function TradePreviewExpandButton(): JSX.Element {
  const { setModalIsOpen } = useTrade();
  const { t } = useTranslation('trade');

  function openOffer() {
    setModalIsOpen(true);
  }

  return (
    <Tooltip title={t('details.preview.buttons.expand')}>
      <Button onClick={openOffer} color="secondary" variant="outlined">
        <SwapHorizIcon />
      </Button>
    </Tooltip>
  );
}

export default TradePreviewExpandButton;
