import { Button, Checkbox, IconButton, Link } from '@mui/material';
import MarketTable from '../../components/marketTable/MarketTable';
import { YugiohCardListing } from '../../services/yugioh/types';
import { useEffect, useState } from 'react';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useAuthenticationStatus, useCurrentUser } from '../../context/user';
import YugiohCardConditionLabel from '../../components/yugioh/YugiohCardConditionLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageHeader from '../../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import CardflowTabs from '../../components/cardflowTabs/CardflowTabs';
import { toastMessages } from '../../constants/toast';
import { useToast } from '../../util/useToast';
import { useTranslation } from 'react-i18next';
import { useSelect } from '../../util/useSelect/useSelect';
import TableActionsMenu, { TableActions } from '../../components/tableActionsMenu/TableActionsMenu';

function SellManagement(): JSX.Element {
  const { data, handleCheck, handleCheckAll, set, checkedAll, restartCheckedAll } =
    useSelect<YugiohCardListing>();
  const { user } = useCurrentUser();
  const currency = user.currency_preference;
  const { isAuthenticated } = useAuthenticationStatus();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const toast = useToast();

  const everythingIsUnselected = data.every((d) => !d.selected);

  const { t } = useTranslation('sell');

  const actions: TableActions = [
    {
      text: t('manage.actions.delistAllButtonText'),
      onClick: delistAll,
    },
    {
      text: t('manage.actions.deleteAllButtonText'),
      onClick: deleteAll,
      color: 'error',
    },
    {
      text: t('manage.actions.deleteSelectedItemsButtonText'),
      onClick: deleteSelectedItems,
      disabled: everythingIsUnselected,
    },
    {
      text: t('manage.actions.delistSelectedItemsButtonText'),
      onClick: delistSelectedItems,
      disabled: everythingIsUnselected,
    },
    {
      text: t('manage.actions.listSelectedItemsButtonText'),
      onClick: listSelectedItems,
      disabled: everythingIsUnselected,
    },
    {
      text: t('manage.actions.listAllButtonText'),
      onClick: listAll,
    },
  ];

  function retrieveListings(page: number) {
    yugiohService
      .getCardListingsByUserId(user.user_id, page)
      .then((listings) => {
        setCount(listings.count);

        set(listings.results);

        restartCheckedAll();
        setPage(page);
      })
      .catch((error) => toast.error({ error }));
  }

  function delistAll() {
    const fetchFunctions = data.map((d) => {
      const listing = d.item;
      return yugiohService.editListing({ ...listing, is_listed: false });
    });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(1);
        toast.success({ toastKey: toastMessages.sellListingsDelisted });
      })
      .catch((error) => toast.error({ error }));
  }

  function listAll() {
    const fetchFunctions = data.map((d) => {
      return yugiohService.editListing({ ...d.item, is_listed: true });
    });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        toast.success({ toastKey: toastMessages.sellListingsListed });
      })
      .catch((error) => toast.error({ error }));
  }

  function deleteAll() {
    const fetchFunctions = data.map((d) => {
      return yugiohService.deleteListingById(d.item.id);
    });

    let newPage: number;
    if (data.length > fetchFunctions.length) {
      newPage = page;
    } else {
      newPage = page === Math.ceil(count / 10) && page !== 1 ? page - 1 : page;
    }

    Promise.all(fetchFunctions)
      .then(() => {
        toast.success({ toastKey: toastMessages.sellListingsDeleted });
        retrieveListings(newPage);
      })
      .catch((error) => toast.error({ error }));
  }

  function deleteSelectedItems() {
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.deleteListingById(d.item.id);
      });

    let newPage: number;
    if (data.length > fetchFunctions.length) {
      newPage = page;
    } else {
      newPage = page === Math.ceil(count / 10) && page !== 1 ? page - 1 : page;
    }

    Promise.all(fetchFunctions)
      .then(() => {
        toast.success({ toastKey: toastMessages.sellListingsDeleted });
        retrieveListings(newPage);
      })
      .catch((error) => toast.error({ error }));
  }

  function delistSelectedItems() {
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.item, is_listed: false });
      });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        toast.success({ toastKey: toastMessages.sellListingsDelisted });
      })
      .catch((error) => toast.error({ error }));
  }

  function listSelectedItems() {
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.item, is_listed: true });
      });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        toast.success({ toastKey: toastMessages.sellListingsListed });
      })
      .catch((error) => toast.error({ error }));
  }

  function toggleListingVisibility(listing: YugiohCardListing, newStatus: boolean) {
    yugiohService
      .editListing({ ...listing, is_listed: newStatus })
      .then(() => {
        retrieveListings(page);
        if (newStatus) {
          toast.success({ toastKey: toastMessages.sellListingListed });
        } else {
          toast.success({ toastKey: toastMessages.sellListingDelisted });
        }
      })
      .catch((error) => toast.error({ error }));
  }
  useEffect(() => {
    if (isAuthenticated) {
      retrieveListings(page);
    }
  }, [user.user_id, page]);
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <CardflowTabs />
      <PageHeader heading={t('manage.title')}>
        <div className="flex gap-4">
          <Button
            sx={{ color: '#0B70E5', borderColor: '#0B70E5', ':hover': { borderColor: '#0B70E5' } }}
            className="rounded-md"
            href={`/user/${user.username}/sales`}
            variant="outlined"
          >
            {t('manage.mySalesButtonText')}
          </Button>
          <Button
            className="rounded-md"
            startIcon={<AddIcon />}
            href="/sell/new"
            variant="outlined"
            color="success"
          >
            {t('manage.newListingButtonText')}
          </Button>
        </div>
      </PageHeader>
      <div className="flex flex-col lg:items-center overflow-auto">
        <MarketTable
          page={page}
          onPageChange={setPage}
          count={count}
          className="w-full rounded-md mt-4 lg:w-10/12 text-left"
        >
          <thead>
            <tr className="text-center">
              <th>
                <Checkbox checked={checkedAll} color="info" onChange={handleCheckAll} />
              </th>
              <th colSpan={2}>{t('manage.table.tableHeaders.cardDetails')}</th>
              <th>{t('manage.table.tableHeaders.available')}</th>
              <th>{t('manage.table.tableHeaders.price')}</th>
              <th>{t('manage.table.tableHeaders.listed')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ld, i) => (
              <tr key={ld.item.id}>
                <td className="w-2" style={{ paddingLeft: 16, paddingRight: 16 }}>
                  <Checkbox
                    onChange={() => {
                      handleCheck(i);
                    }}
                    checked={data[i].selected}
                    color="info"
                  />
                </td>
                <td className="text-center w-[110px]">
                  <Link
                    href={`/sell/listing/${ld.item.id}/edit`}
                    sx={{
                      color: '#0B70E5',
                      textDecorationColor: '#0B70E5',
                      textDecoration: 'none',
                      ':hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {ld.item.card_name}
                  </Link>
                </td>
                <td className="w-[110px]">
                  <YugiohCardConditionLabel className="w-[110px]" condition={ld.item.condition} />
                </td>
                <td className="w-48 text-center">{ld.item.quantity}</td>
                <td className="w-48 font-bold text-center">
                  {ld.item.price.toFixed(2)} {currency}
                </td>
                <td className="text-center w-4">
                  <IconButton
                    onClick={() => toggleListingVisibility(ld.item, !ld.item.is_listed)}
                    sx={{ color: ld.item.is_listed ? 'blue' : 'inherit' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </MarketTable>
        <TableActionsMenu
          selectedItemsCount={data.filter((d) => d.selected).length}
          itemsCountNamespace="sell"
          itemsCountTranslationKey="manage.actions.selectedItems"
          actions={actions}
        />
      </div>
    </section>
  );
}

export default SellManagement;
