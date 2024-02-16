import { SellerRankData, sellerRank, sellerRankData } from '../constants/sellerRank';

type Rank = {
  rank: sellerRank;
  data: SellerRankData;
};

const ranks: Rank[] = [
  {
    rank: 'pro',
    data: sellerRankData.pro,
  },
  {
    rank: 'renowned',
    data: sellerRankData.renowned,
  },
  {
    rank: 'seller',
    data: sellerRankData.seller,
  },
];

/**
 * @param sales the amount of sales that the user has achieved
 * @returns an object containing the appropriate data for the user's seller rank.
 */
export function determineSellerRank(sales: number): SellerRankData {
  for (const rank of ranks) {
    if (sales >= rank.data.minimumSales) {
      return sellerRankData[rank.rank];
    }
  }

  return sellerRankData.seller;
}
