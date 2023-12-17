import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CardSearchLoader } from '../services/yugioh/types';
import PageHeader from '../components/PageHeader';
import MarketTable from '../components/marketTable/MarketTable';
import { retrieveCardsForDisplay } from '../components/searchField/retrieveCardsForDisplay/retrieveCardsForDisplay';
import React, { useMemo, useState } from 'react';
import SearchTableRow from '../components/search/SearchTableRow';
import { TextField } from '@mui/material';
import SearchButton from '../components/navigation/desktop/buttons/SearchButton';
import { yugiohService } from '../services/yugioh/yugiohService';

function Search(): JSX.Element {
  const data: CardSearchLoader = useLoaderData() as CardSearchLoader;
  const navigate = useNavigate();
  const params = useParams();
  const [cards, setCards] = useState(data.cards);
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const searchResults = useMemo(() => retrieveCardsForDisplay(cards, false), [cards]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSearchQuery(event.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      yugiohService.searchCardsByName(searchQuery).then((res) => setCards(res));
      navigate('/search/' + searchQuery);
    } else {
      setCards([]);
      navigate('/search');
    }
  }
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <PageHeader heading="Buy / Search" />
      <div className="min-h-full mt-2 flex items-center w-full flex-col gap-4">
        <form className="w-2/3 bg-white relative z-0" onSubmit={handleSubmit}>
          <TextField
            size="small"
            className="w-full"
            sx={{ position: 'static' }}
            value={searchQuery}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <SearchButton />,
            }}
          />
        </form>
        <MarketTable className="text-center w-2/3 bg-white border">
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
