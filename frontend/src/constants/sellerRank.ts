export type sellerRank = 'seller' | 'renowned' | 'pro';
export type SellerRankData = {
  /** Used in the sales label, as the PRO one has a different text color */
  textColor: string;
  border: string;
  fill: string;
  tooltipText: string;
  minimumSales: number;
};

export const sellerRankData: Readonly<Record<sellerRank, SellerRankData>> = Object.freeze({
  seller: {
    textColor: '#050505',
    border: '#666666',
    fill: 'white',
    tooltipText: 'This user has less than 5000 sales',
    minimumSales: 0,
  },
  renowned: {
    textColor: '#050505',
    border: '#E9E92F',
    fill: '#E9E92F',
    minimumSales: 5000,
    tooltipText: 'This user has over 5000 sales',
  },
  pro: {
    textColor: '#1FCCE0',
    border: '#1FCCE0',
    fill: '#1FCCE0',
    minimumSales: 10_000,
    tooltipText: 'This user has over 10000 sales',
  },
});
