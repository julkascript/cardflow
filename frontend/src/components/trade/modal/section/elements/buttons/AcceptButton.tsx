import { Button } from '@mui/material';
import { useTrade } from '../../../../../../context/trade';
import { type TradeModalButtonProps } from './ButtonProps';
import { offersAreTheSame } from '../../../../../../util/offersAreTheSame';
import { useTranslation } from 'react-i18next';

function AcceptButton(props: TradeModalButtonProps): JSX.Element {
  const { trade, initialTradeOffer } = useTrade();
  const { t } = useTranslation('trade');

  if (!offersAreTheSame(trade, initialTradeOffer)) {
    return <></>;
  }

  return (
    <Button
      sx={{ color: 'white', ':hover': { color: 'black' } }}
      variant="contained"
      color="success"
      onClick={props.onClick}
    >
      {t('modal.buttons.accept')}
    </Button>
  );
}

export default AcceptButton;
