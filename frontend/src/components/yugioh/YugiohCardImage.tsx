import { useTheme } from '@mui/material';

function YugiohCardImage(): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  return (
    <div
      className={`bg-white p-8 w-[314px] h-[422px] border-[${secondary}] border rounded flex justify-center items-center`}
    >
      <img src="https://images.ygoprodeck.com/images/cards/46986421.jpg" />
    </div>
  );
}

export default YugiohCardImage;
