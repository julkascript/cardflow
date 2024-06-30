export type sellerRank = 'seller' | 'renowned' | 'pro';
export type SellerRankData = {
  /** Used in the sales label, as the PRO one has a different text color */
  textColor: string;
  border: string;
  fill: string;
  minimumSales: number;
};

export const sellerRankData: Readonly<Record<sellerRank, SellerRankData>> = Object.freeze({
  seller: {
    textColor: '#050505',
    border: '#666666',
    fill: 'white',
    minimumSales: 0,
  },
  renowned: {
    textColor: '#050505',
    border: '#E9E92F',
    fill: '#E9E92F',
    minimumSales: 5000,
  },
  pro: {
    textColor: '#1FCCE0',
    border: '#1FCCE0',
    fill: '#1FCCE0',
    minimumSales: 10_000,
  },
});
