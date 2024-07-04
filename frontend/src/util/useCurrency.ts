import { currencies, defaultCurrency } from '../constants/currencies';
import { useCurrentUser } from '../context/user';

/**
 * Handles how a price is displayed, based on the user's currency preference.
 * @param priceInBGN defaults to 0 if not passed, this is done in cases where
 * the only goal of the hook is to display the currency preference (without
 * calculating any price)
 * @returns an object containing the user's preferred currency and the price
 * converted to that currency.
 */
export const useCurrency = (priceInBGN = 0) => {
  const { user } = useCurrentUser();

  const currency = user.currency_preference;
  const price = Number(
    (priceInBGN / currencies[currency].exchangeRate[defaultCurrency]).toFixed(2),
  );

  return { currency, price };
};
