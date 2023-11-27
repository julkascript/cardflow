import { useTheme } from '@mui/material';

function YugiohCardImage(): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  return (
    <div
      className={`bg-white p-8 w-[314px] h-[422px] border-[${secondary}] border rounded flex justify-center items-center`}
    >
      <img src="https://static-7.studiobebop.net/ygo_data/card_variants/LOB-E101.jpg" />
    </div>
  );
}

export default YugiohCardImage;
