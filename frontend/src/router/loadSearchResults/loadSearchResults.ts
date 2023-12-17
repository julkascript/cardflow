import { Params } from 'react-router-dom';
import { CardSearchLoader } from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';

export async function loadSearchResults({ params }: { params: Params }): Promise<CardSearchLoader> {
  const query = params.query || '';
  if (!query) {
    return { cards: [] };
  }
  const cards = await yugiohService.searchCardsByName(query);
  return { cards };
}
