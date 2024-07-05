export const defaultCurrency: currency = 'BGN';
export const currencies: CurrencyData[] = [
  {
    code: 'BGN',
    displayCurrency: 'лв.',
  },
  {
    code: 'EUR',
    displayCurrency: 'EUR',
  },
];

export type currency = 'BGN' | 'EUR';
type CurrencyData = {
  code: currency;
  displayCurrency: string;
};
