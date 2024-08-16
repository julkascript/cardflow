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
  const cash = trade.initiator === props.user ? trade.initiator_cash : trade.recipient_cash;
  return (
    <section>
      <TradeModalSearch user={props.user} />
      {listings.map((l) => (
        <TradeModalBox user={props.user} key={l.id} listing={l} />
      ))}
      {cash ? <TradeModalBox user={props.user} cash={cash} /> : null}
    </section>
  );
}

export default TradeModalSection;
