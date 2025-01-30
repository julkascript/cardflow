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
    <section className="flex gap-24 items-center my-16 flex-col lg:flex-row">
      <div className="w-full sm:w-[400px]">
        <TradeModalSearch user={props.user} />
      </div>
      <div className="flex gap-16 items-center lg:items-start flex-col lg:flex-row lg:flex-1 lg:overflow-x-auto">
        {listings.map((l) => (
          <TradeModalBox user={props.user} key={l.id} listing={l} />
        ))}
        <TradeModalBox user={props.user} cash={cash || undefined} />
      </div>
    </section>
  );
}

export default TradeModalSection;
