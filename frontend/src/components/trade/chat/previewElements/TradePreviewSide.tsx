import { tradeStatusResult } from '../../../../constants/tradeStatus';
import { TradeParticipant } from '../../../../services/trade/types';
import { YugiohCardListing } from '../../../../services/yugioh/types';
import PreviewTradeBox from './previewItems/PreviewTradeBox';
import TradePreviewSideUser from './TradePreviewSideUser';

type TradePreviewSideProps = {
  listings: YugiohCardListing[];
  cash?: number;
  user: TradeParticipant;
  decision: tradeStatusResult;
};

function TradePreviewSide(props: TradePreviewSideProps): JSX.Element {
  return (
    <section className="flex flex-col gap-8 my-6">
      <TradePreviewSideUser user={props.user} decision={props.decision} />
      <div className="grid gap-4 sm:gap-0 grid-cols-3">
        {props.listings.map((listing) => (
          <PreviewTradeBox key={listing.id} listing={listing} />
        ))}
        <PreviewTradeBox cash={props.cash} />
      </div>
    </section>
  );
}

export default TradePreviewSide;
