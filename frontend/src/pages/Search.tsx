import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CardSearchLoader } from '../services/yugioh/types';
import MarketTable from '../components/marketTable/MarketTable';
import React, { useState } from 'react';
import SearchTableRow from '../components/search/SearchTableRow';
import { TextField } from '@mui/material';
import SearchButton from '../components/navigation/desktop/buttons/SearchButton';
import { yugiohService } from '../services/yugioh/yugiohService';
import { useEffectAfterInitialLoad } from '../util/useEffectAfterInitialLoad';
import CardflowTabs from '../components/sellListing/CardflowTabs';
import BreadcrumbNavigation, { BreadcrumbLink } from '../components/BreadcrumbNavigation';
import { useToast } from '../util/useToast';
import { useTranslation } from 'react-i18next';

function Search(): JSX.Element {
  const data: CardSearchLoader = useLoaderData() as CardSearchLoader;
  const navigate = useNavigate();
  const params = useParams();
  const [cards, setCards] = useState(data.cards);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(params.query || '');

  const { t: commonT } = useTranslation('common');
  const { t } = useTranslation('buy');

  const toast = useToast();

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/buy',
      text: commonT('breadcrumbs.buy.title'),
    },
  ];

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
      setCards({
        results: [],
        next: null,
        previous: null,
        count: 0,
      });
      navigate('/search/');
    }

    setPage(1);
  }

  function changePage(page: number) {
    yugiohService
      .searchCardsByName(searchQuery, page)
      .then((data) => {
        setCards(data);
        setPage(page);
      })
      .catch((error) => toast.error({ error }));
  }

  useEffectAfterInitialLoad(() => {
    const query = params.query || '';
    if (query) {
      yugiohService
        .searchCardsByName(query)
        .then(setCards)
        .catch((error) => toast.error({ error }));
    } else {
      setCards({
        results: [],
        next: null,
        previous: null,
        count: 0,
      });
    }

    setPage(1);
    setSearchQuery(query);
  }, [params.query]);
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <CardflowTabs />
      <BreadcrumbNavigation
        heading={commonT('breadcrumbs.buy.search.title')}
        links={breadcrumbNavigation}
      />
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
        <MarketTable
          page={page}
          onPageChange={changePage}
          count={cards.count}
          className="text-center w-full md:w-11/12 lg:w-2/3 bg-white border"
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} colSpan={3}>
                {t('search.table.tableHeaders.name')}
              </th>
              <th style={{ textAlign: 'center' }}>{t('search.table.tableHeaders.rarity')}</th>
            </tr>
          </thead>
          <tbody>
            {cards.results.map((c) => (
              <SearchTableRow key={c.id} card={c} />
            ))}
          </tbody>
        </MarketTable>
      </div>
    </section>
  );
}

export default Search;
