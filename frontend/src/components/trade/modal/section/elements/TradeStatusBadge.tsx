import { CheckCircle, DoNotDisturbAlt } from '@mui/icons-material';
import { tradeStatusStage } from '../../../../../constants/tradeStatus';
import { useTrade } from '../../../../../context/trade';

const iconsPerStatus: Record<tradeStatusStage, React.ReactNode> = {
  rejected: <DoNotDisturbAlt color="error" />,
  accepted: <CheckCircle color="success" />,
  negotiate: <CheckCircle color="success" />,
};

function TradeStatusBadge(): JSX.Element {
  const { trade } = useTrade();
  return <>{iconsPerStatus[trade.trade_status]}</>;
}

export default TradeStatusBadge;
