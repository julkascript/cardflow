import { useCurrency } from '../../util/useCurrency';

type SummaryDataProps = {
  data: number;
  summary: string;
  boldedData?: boolean;
};

function SummaryData(props: SummaryDataProps): JSX.Element {
  const data = useCurrency(props.data);

  return (
    <li className="mb-2">
      <div className="flex justify-between">
        <span>{props.summary}</span>
        <span className={props.boldedData ? 'font-bold' : ''}>{data}</span>
      </div>
    </li>
  );
}

export default SummaryData;
