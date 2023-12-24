import { useTheme } from '@mui/material';
import { ChangeEvent, useState } from 'react';

type YugiohCardQuantityFieldProps = {
  quantity: number;
};

function YugiohCardQuantityField(props: YugiohCardQuantityFieldProps): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = Number(event.target.value);
    if (value > 0 && value <= props.quantity) {
      setQuantity(value);
    }
  }
  return (
    <input
      className="p-1 w-16 h-10 text-center border rounded-sm"
      style={{ borderColor: secondary }}
      type="number"
      onChange={handleChange}
      value={quantity}
    />
  );
}

export default YugiohCardQuantityField;
