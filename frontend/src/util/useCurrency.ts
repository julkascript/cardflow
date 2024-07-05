import { currencies } from '../constants/currencies';
import { useCurrentUser } from '../context/user';

export const useCurrency = (price: number) => {
  const { user } = useCurrentUser();

  const currency = currencies.find((c) => c.code === user.currency_preference) || currencies[0];

  return `${price.toFixed(2)} ${currency.displayCurrency}`;
};
