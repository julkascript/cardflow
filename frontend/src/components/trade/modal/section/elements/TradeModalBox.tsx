import { TradeParticipant } from '../../../../../services/trade/types';
import { YugiohCardListing } from '../../../../../services/yugioh/types';
import TradeCash from './TradeCash';
import TradeEmptyBox from './TradeEmptyBox';
import TradeListingImage from './TradeListingImage';

type TradeModalBoxProps = {
  listing?: YugiohCardListing;
  cash?: number;
  user: TradeParticipant;
};

function TradeModalBox(props: TradeModalBoxProps): JSX.Element {
  if (props.cash) {
    return <TradeCash cash={props.cash} />;
  }

  if (props.listing) {
    return <TradeListingImage user={props.user} listing={props.listing} />;
  }

  return <TradeEmptyBox />;
}

export default TradeModalBox;
