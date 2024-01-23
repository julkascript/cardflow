import { Typography } from '@mui/material';

type CheckoutDataProps = {
  data: number;
  summary: string;
  withDollar?: boolean;
};

function CheckoutData(props: CheckoutDataProps): JSX.Element {
  if (props.withDollar) {
    return (
      <li className="flex justify-between gap-4">
        <Typography color="text.secondary" component="span">
          {props.summary}
        </Typography>
        <Typography color="text.secondary" component="span">
          {props.data}
        </Typography>
      </li>
    );
  }
  return (
    <li className="flex justify-between gap-4">
      <Typography color="text.secondary" component="span">
        {props.summary}
      </Typography>
      <Typography color="text.secondary" component="span">
        ${props.data.toFixed(2)}
      </Typography>
    </li>
  );
}

export default CheckoutData;
