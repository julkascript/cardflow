import { useTranslation } from 'react-i18next';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import { useCurrentUser } from '../../context/user';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import MarketTable from '../../components/marketTable/MarketTable';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import { useToast } from '../../util/useToast';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import SearchButton from '../../components/navigation/desktop/buttons/SearchButton';
import { UserSearchResult } from '../../services/user/types';
import { PaginatedItem } from '../../services/yugioh/types';
import { userService } from '../../services/user/user';
import UserSearchResultRow from '../../components/profile/userSearch/UserSearchResultRow';

function SearchUsers(): JSX.Element {
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const { user } = useCurrentUser();

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: commonT('breadcrumbs.account.title'),
      href: `/user/${user.username}`,
    },
  ];

  const navigate = useNavigate();
  const params = useParams();
  const [users, setUsers] = useState<PaginatedItem<UserSearchResult>>({
    results: [],
    next: null,
    previous: null,
    count: 0,
  });
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(params.query || '');

  const toast = useToast();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSearchQuery(event.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (searchQuery) {
      userService.searchUsersByUsername(searchQuery).then(setUsers).catch(toast.error);
      navigate('/accounts/search/' + searchQuery);
    } else {
      setUsers({
        results: [],
        next: null,
        previous: null,
        count: 0,
      });
      navigate('/accounts/search');
    }

    setPage(1);
  }

  function changePage(page: number) {
    userService
      .searchUsersByUsername(searchQuery)
      .then((res) => {
        setUsers(res);
        setPage(page);
      })
      .catch(toast.error);
  }

  useEffectAfterInitialLoad(() => {
    const query = params.query || '';
    if (query) {
      userService.searchUsersByUsername(searchQuery).then(setUsers).catch(toast.error);
    } else {
      setUsers({
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
        heading={commonT('breadcrumbs.account.userSearch.title')}
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
          count={users.count}
          className="text-center w-full md:w-11/12 lg:w-2/3 bg-white border"
        >
          <thead>
            <tr>
              <th colSpan={3}>{t('search.table.tableHeaders.user')}</th>
              <th>{t('search.table.tableHeaders.visibleListings')}</th>
              <th>{t('search.table.tableHeaders.trade')}</th>
            </tr>
          </thead>
          <tbody>
            {users.results.map((user) => (
              <UserSearchResultRow user={user} />
            ))}
          </tbody>
        </MarketTable>
      </div>
    </section>
  );
}

export default SearchUsers;
