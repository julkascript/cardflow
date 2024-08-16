import { useTrade } from '../../../../context/trade';
import { TradeParticipant } from '../../../../services/trade/types';
import TradeModalBox from './elements/TradeModalBox';
import TradeModalSearch from './elements/TradeModalSearch';

type TradeModalSectionProps = {
  user: TradeParticipant;
};

function TradeModalSection(props: TradeModalSectionProps): JSX.Element {
  const { trade } = useTrade();
  const listings =
    trade.initiator.id === props.user.id ? trade.initiator_listing : trade.recipient_listing;
  const cash = trade.initiator.id === props.user.id ? trade.initiator_cash : trade.recipient_cash;
  return (
    <section className="flex gap-24 items-center overflow-hidden w-full">
      <div className="w-[400px]">
        <TradeModalSearch user={props.user} />
      </div>
      <div className="inline-flex gap-8 flex-shrink-1 flex-grow-1 overflow-x-auto flex-nowrap">
        {listings.map((l) => (
          <TradeModalBox user={props.user} key={l.id} listing={l} />
        ))}
        {cash ? <TradeModalBox user={props.user} cash={cash} /> : null}
        {listings.length === 0 ? <TradeModalBox user={props.user} /> : null}
      </div>
    </section>
  );
}

export default TradeModalSection;
