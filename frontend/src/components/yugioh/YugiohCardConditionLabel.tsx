type condition = 'poor' | 'played' | 'good' | 'excellent';

const conditionColors: Record<condition, string> = {
  poor: '#F73378',
  played: '#FF9100',
  good: '#00E676',
  excellent: '#33BFFF',
};

type YugiohCardConditionLabelProps = {
  condition: condition;
  className?: string;
};

function YugiohCardConditionLabel(props: YugiohCardConditionLabelProps) {
  const color = conditionColors[props.condition];

  return (
    <div
      style={{ color, borderColor: color }}
      className={`pl-2 pr-2 border flex items-center justify-center text-center rounded-xl uppercase ${
        props.className || ''
      }`}
    >
      {props.condition}
    </div>
  );
}

export default YugiohCardConditionLabel;
