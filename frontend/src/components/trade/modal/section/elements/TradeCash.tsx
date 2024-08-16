import { useCurrency } from '../../../../../util/useCurrency';

type TradeCashProps = {
  cash: number;
};

function TradeCash(props: TradeCashProps): JSX.Element {
  const cash = useCurrency(props.cash);
  return <div>{cash}</div>;
}

export default TradeCash;
