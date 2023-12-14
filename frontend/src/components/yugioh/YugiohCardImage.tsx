import { useTheme } from '@mui/material';

type YugiohCardImageProps = {
  src: string;
};

function YugiohCardImage(props: YugiohCardImageProps): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  return (
    <div
      className={`bg-white p-8 w-[314px] h-[422px] border-[${secondary}] border rounded flex justify-center items-center`}
    >
      <img src={props.src} />
    </div>
  );
}

export default YugiohCardImage;
