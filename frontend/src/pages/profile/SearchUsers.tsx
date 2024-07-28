import { useTranslation } from 'react-i18next';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import { useCurrentUser } from '../../context/user';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import MarketTable from '../../components/marketTable/MarketTable';
import { useToast } from '../../util/useToast';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import SearchButton from '../../components/navigation/desktop/buttons/SearchButton';
import { UserSearchResult } from '../../services/user/types';
import { PaginatedItem } from '../../services/yugioh/types';
import { userService } from '../../services/user/user';
import UserSearchResultRow from '../../components/profile/userSearch/UserSearchResultRow';
import { HttpError } from '../../util/HttpError';

function SearchUsers(): JSX.Element {
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const { user } = useCurrentUser();

  const [isError, setIsError] = useState(false);

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: commonT('breadcrumbs.account.title'),
      href: `/user/${user.username}`,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const username = searchParams.get('username');

  const [users, setUsers] = useState<PaginatedItem<UserSearchResult>>({
    results: [],
    next: null,
    previous: null,
    count: 0,
  });

  const toast = useToast();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const username = String(formData.get('username'));
    if (!username) {
      searchParams.delete('username');
    } else {
      searchParams.set('username', username);
    }

    setSearchParams(searchParams);
  }

  function changePage(page: number) {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  const emptyMessageTranslationKey = emptyMessageKey(isError, users.count);

  useEffect(() => {
    if (username) {
      userService
        .searchUsersByUsername(username, page)
        .then((users) => {
          setUsers(users);
          setIsError(false);
        })
        .catch((err) => {
          if (err instanceof HttpError && err.err.status === 404) {
            setIsError(true);
            setUsers({
              results: [],
              next: null,
              previous: null,
              count: 0,
            });
          } else {
            toast.error({
              excludedStatusCodes: [404],
              error: err,
            });
          }
        });
    } else {
      setUsers({
        results: [],
        next: null,
        previous: null,
        count: 0,
      });

      setIsError(false);
    }
  }, [page, username]);

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
            name="username"
            variant="outlined"
            InputProps={{
              startAdornment: <SearchButton />,
            }}
          />
        </form>
        <MarketTable
          page={Number(searchParams.get('page')) || 1}
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
            {!emptyMessageTranslationKey ? (
              users.results.map((user) => <UserSearchResultRow key={user.username} user={user} />)
            ) : (
              <tr>
                <td colSpan={5}>{t(`search.${emptyMessageTranslationKey}`)}</td>
              </tr>
            )}
          </tbody>
        </MarketTable>
      </div>
    </section>
  );
}

export default SearchUsers;

function emptyMessageKey(isError: boolean, count: number): string {
  if (count > 0) {
    return '';
  }

  if (isError) {
    return 'noUsersFound';
  }

  return 'hasNotSearched';
}
