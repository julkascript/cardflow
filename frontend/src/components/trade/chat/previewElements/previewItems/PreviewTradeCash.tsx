import { Typography } from '@mui/material';
import { useCurrentUser } from '../../../../../context/user';

type PreviewTradeCashProps = {
  cash: number;
};

function PreviewTradeCash(props: PreviewTradeCashProps): JSX.Element {
  const { user } = useCurrentUser();
  const currency = user.currency_preference;
  return (
    <div className="flex mx-auto items-center justify-center w-[71px] h-[102px] border-2 border-dashed">
      <Typography fontSize="12pt" fontWeight="bold" className="font-bold" color="text.secondary">
        {props.cash} {currency}
      </Typography>
    </div>
  );
}

export default PreviewTradeCash;
