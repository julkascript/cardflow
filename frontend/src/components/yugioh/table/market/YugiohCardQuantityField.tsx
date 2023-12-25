import { useTheme } from '@mui/material';
import { ChangeEvent } from 'react';

type YugiohCardQuantityFieldProps = {
  quantity: number;
  onChange: (value: number) => void;
  max: number;
  hidden: boolean;
};

function YugiohCardQuantityField(props: YugiohCardQuantityFieldProps): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = Number(event.target.value);
    if (value > 0 && value <= props.max) {
      props.onChange(value);
    }
  }

  if (props.hidden) {
    return (
      <div
        aria-hidden={true}
        className="p-1 w-16 h-10 text-center border rounded-sm invisible"
      ></div>
    );
  }

  return (
    <input
      className="p-1 w-16 h-10 text-center border rounded-sm"
      style={{ borderColor: secondary }}
      type="number"
      onChange={handleChange}
      value={props.quantity}
    />
  );
}

export default YugiohCardQuantityField;
