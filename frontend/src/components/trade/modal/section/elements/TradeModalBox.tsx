import { YugiohCardListing } from '../../../../../services/yugioh/types';

type TradeModalBoxProps = {
  listing?: YugiohCardListing;
  cash?: number;
  onRemove: (listing: YugiohCardListing) => void;
};

function TradeModalBox(props: TradeModalBoxProps): JSX.Element {
  return <div></div>;
}

export default TradeModalBox;
