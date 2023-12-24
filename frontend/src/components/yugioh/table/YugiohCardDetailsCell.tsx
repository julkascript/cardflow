import { Typography } from '@mui/material';

type YugiohCardDetailsCellProps = {
  heading: string;
  data: string | number;
};

function YugiohCardDetailsCell(props: YugiohCardDetailsCellProps): JSX.Element {
  return (
    <td className="pl-8 pr-8 first:border-r-2 border-t-2 w-1/2">
      <h3>{props.heading}</h3>
      <Typography component="p" color="text.secondary">
        {props.data}
      </Typography>
    </td>
  );
}

export default YugiohCardDetailsCell;
