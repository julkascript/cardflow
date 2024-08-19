import { Typography } from '@mui/material';
import { useCurrentUser } from '../../../../../context/user';

type TradeCashProps = {
  cash: number;
};

function TradeCash(props: TradeCashProps): JSX.Element {
  const { user } = useCurrentUser();
  const currency = user.currency_preference;
  return (
    <div className="flex items-center justify-center w-[245px] border-2 border-dashed lg:flex-shrink-0 lg:flex-grow-0 lg:basis-[245px] h-[356px]">
      <Typography fontSize="22pt" fontWeight="bold" className="font-bold" color="text.secondary">
        {props.cash} {currency}
      </Typography>
    </div>
  );
}

export default TradeCash;
