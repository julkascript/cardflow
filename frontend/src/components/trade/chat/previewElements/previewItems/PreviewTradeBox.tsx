import { YugiohCardListing } from '../../../../../services/yugioh/types';
import PreviewTradeCash from './PreviewTradeCash';
import PreviewTradeEmptyBox from './PreviewTradeEmptyBox';
import PreviewTradeListingImage from './PreviewTradeListingImage';

type PreviewTradeBoxProps = {
  listing?: YugiohCardListing;
  cash?: number;
};

function PreviewTradeBox(props: PreviewTradeBoxProps): JSX.Element {
  if (props.cash) {
    return <PreviewTradeCash cash={props.cash} />;
  }

  if (props.listing) {
    return <PreviewTradeListingImage listing={props.listing} />;
  }

  return <PreviewTradeEmptyBox />;
}

export default PreviewTradeBox;
