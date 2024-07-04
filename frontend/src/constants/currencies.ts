export const currencies: Readonly<Record<currency, CurrencyData>> = Object.freeze({
  BGN: {
    code: 'BGN',
    exchangeRate: {
      EUR: 0.51,
      BGN: 1,
    },
  },
  EUR: {
    code: 'EUR',
    exchangeRate: {
      EUR: 1,
      BGN: 1.96,
    },
  },
});

export const defaultCurrency: currency = currencies.BGN.code;

export type currency = 'BGN' | 'EUR';
type CurrencyData = {
  exchangeRate: Record<currency, number>;
  code: currency;
};
