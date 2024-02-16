import { Typography } from '@mui/material';

type MarketAcitivtyTableCellProps = {
  heading: string;
  data: string | number;
};

function MarketActivityTableCell(props: MarketAcitivtyTableCellProps): JSX.Element {
  return (
    <td className="p-4 lg:pl-12 lg:pr-12 first:border-r-2 border-t-2 w-1/2">
      <h4 className="font-bold">{props.heading}</h4>
      <Typography component="p" color="text.secondary">
        {props.data}
      </Typography>
    </td>
  );
}

export default MarketActivityTableCell;
