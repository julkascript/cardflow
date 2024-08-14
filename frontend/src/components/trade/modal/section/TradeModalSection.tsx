import { Trade } from '../../../../services/trade/types';

type TradeModalSectionProps = {
  trade: Trade;
  /**
   * ``current`` - the logged in user
   *
   * ``other`` - the other user
   */
  side: 'current' | 'other';
};

function TradeModalSection(props: TradeModalSectionProps): JSX.Element {
  return <section></section>;
}

export default TradeModalSection;
