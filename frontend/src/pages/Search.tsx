import { useLoaderData } from 'react-router-dom';
import { CardSearchLoader } from '../services/yugioh/types';
import PageHeader from '../components/PageHeader';
import MarketTable from '../components/marketTable/MarketTable';
import { retrieveCardsForDisplay } from '../components/searchField/retrieveCardsForDisplay/retrieveCardsForDisplay';
import { useMemo } from 'react';
import SearchTableRow from '../components/search/SearchTableRow';

function Search(): JSX.Element {
  const data: CardSearchLoader = useLoaderData() as CardSearchLoader;
  const cards = data.cards;
  const searchResults = useMemo(() => retrieveCardsForDisplay(cards, false), [cards]);

  return (
    <section className="bg-[#F5F5F5] h-full">
      <PageHeader heading="Buy / Search" />
      <div className="flex justify-center">
        <MarketTable className="text-center w-6/12">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} colSpan={3}>
                Name
              </th>
              <th style={{ textAlign: 'center' }}>Rarity</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.results.map((sr) => (
              <SearchTableRow key={sr.card.card_in_set_id} card={sr} />
            ))}
          </tbody>
        </MarketTable>
      </div>
    </section>
  );
}

export default Search;
