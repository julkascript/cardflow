import { Typography } from '@mui/material';
import { useCurrency } from '../../util/useCurrency';

type CheckoutDataProps = {
  data: number;
  summary: string;
  withDollar?: boolean;
};

function CheckoutData(props: CheckoutDataProps): JSX.Element {
  const price = useCurrency(props.data);
  if (!props.withDollar) {
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
        {price}
      </Typography>
    </li>
  );
}

export default CheckoutData;
