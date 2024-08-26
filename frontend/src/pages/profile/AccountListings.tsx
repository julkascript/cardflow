import { useParams, useSearchParams } from 'react-router-dom';
import MarketTable from '../../components/marketTable/MarketTable';
import SearchButton from '../../components/navigation/desktop/buttons/SearchButton';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { PaginatedItem, YugiohCardListing } from '../../services/yugioh/types';
import { useToast } from '../../util/useToast';
import { TextField } from '@mui/material';
import AccountListingsSearchResultRow from '../../components/profile/accountListingsSearch/AccountListingsSearchResultRow';
import { yugiohService } from '../../services/yugioh/yugiohService';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import ProfileNavigation from '../../components/profile/ProfileNavigation';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';

function AccountListings(): JSX.Element {
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const username = params.username;

  const breadcrumbLinks: BreadcrumbLink[] = [
    {
      href: `/user/${username}`,
      text: commonT('breadcrumbs.account.title'),
    },
  ];

  const page = Number(searchParams.get('page')) || 1;
  const cardName = searchParams.get('card_name') || '';

  const [listings, setListings] = useState<PaginatedItem<YugiohCardListing>>({
    results: [],
    next: null,
    previous: null,
    count: 0,
  });

  const toast = useToast();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const cardName = String(formData.get('cardName'));
    if (!cardName) {
      searchParams.delete('card_name');
    } else {
      searchParams.set('card_name', cardName);
    }

    setSearchParams(searchParams);
  }

  function changePage(page: number) {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  useEffect(() => {
    if (username) {
      yugiohService
        .searchListingsByCardNameAndUsername(username, page, cardName)
        .then(setListings)
        .catch(toast.error);
    }
  }, [page, cardName, username]);

  return (
    <section className="bg-[#F5F5F5] w-full">
      <CardflowTabs />
      <BreadcrumbNavigation links={breadcrumbLinks} heading={username}></BreadcrumbNavigation>
      <div className="block w-full text-center p-8 gap-24 lg:text-left lg:flex lg:p-24">
        <ProfileNavigation />
        <div className="min-h-full w-full lg:w-5/6 mt-2 flex flex-col gap-4 overflow-x-auto">
          <form className="bg-white relative z-0" onSubmit={handleSubmit}>
            <TextField
              size="small"
              className="w-full"
              sx={{ position: 'static' }}
              name="cardName"
              variant="outlined"
              InputProps={{
                startAdornment: <SearchButton />,
              }}
            />
          </form>
          <MarketTable
            page={Number(searchParams.get('page')) || 1}
            onPageChange={changePage}
            count={listings.count}
            className="text-center w-full lg:full bg-white border"
          >
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} colSpan={4}>
                  {t('listingsSearch.table.tableHeaders.name')}
                </th>
                <th>{t('listingsSearch.table.tableHeaders.rarity')}</th>
                <th>{t('listingsSearch.table.tableHeaders.availability')}</th>
                <th colSpan={3}>{t('listingsSearch.table.tableHeaders.buy')}</th>
              </tr>
            </thead>
            <tbody>
              {listings.results.map((l) => (
                <AccountListingsSearchResultRow key={l.id} listing={l} />
              ))}
            </tbody>
          </MarketTable>
        </div>
      </div>
    </section>
  );
}

export default AccountListings;
