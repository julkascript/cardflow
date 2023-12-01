import { useTheme } from '@mui/material';
import { ChangeEvent, useState } from 'react';

function YugiohCardQuantityField(): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = Number(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  }
  return (
    <input
      className="p-2 w-16 h-12 text-center border rounded-sm"
      style={{ borderColor: secondary }}
      type="number"
      onChange={handleChange}
      value={quantity}
    />
  );
}

export default YugiohCardQuantityField;
