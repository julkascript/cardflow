type SummaryDataProps = {
  data: number;
  summary: string;
  boldedData?: boolean;
};

function SummaryData(props: SummaryDataProps): JSX.Element {
  return (
    <li className="mb-2">
      <div className="flex justify-between">
        <span>{props.summary}</span>
        <span className={props.boldedData ? 'font-bold' : ''}>${props.data.toFixed(2)}</span>
      </div>
    </li>
  );
}

export default SummaryData;
