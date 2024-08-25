import { Button, Checkbox, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MarketTable from '../../components/marketTable/MarketTable';
import PageHeader from '../../components/PageHeader';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import { useSelect } from '../../util/useSelect/useSelect';
import { useAuthenticationStatus, useCurrentUser } from '../../context/user';
import { useEffect, useState } from 'react';
import { useToast } from '../../util/useToast';
import { useTranslation } from 'react-i18next';
import { tradeService } from '../../services/trade/trade';
import { Trade, TradeParticipant } from '../../services/trade/types';
import TableActionsMenu, { TableActions } from '../../components/tableActionsMenu/TableActionsMenu';
import { toastMessages } from '../../constants/toast';

function MyTrades(): JSX.Element {
  const {
    data: trades,
    handleCheck,
    handleCheckAll,
    set,
    checkedAll,
    restartCheckedAll,
  } = useSelect<Trade>();

  const { isAuthenticated } = useAuthenticationStatus();
  const { user } = useCurrentUser();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const toast = useToast();

  const everythingIsUnselected = trades
    .filter((t) => t.item.trade_status === 'negotiate')
    .every((t) => !t.selected);
  const { t } = useTranslation('trade');

  function retrieveTrades(page: number) {
    tradeService
      .getTrades(page)
      .then((trades) => {
        setCount(trades.count);
        set(trades.results);

        restartCheckedAll();
        setPage(page);
      })
      .catch(toast.error);
  }

  function rejectAll() {
    const rejectMethods = trades
      .filter((t) => t.item.trade_status === 'negotiate')
      .map((t) => tradeService.reject(t.item.id));

    Promise.all(rejectMethods)
      .then(() => {
        retrieveTrades(1);
        toast.success({ toastKey: toastMessages.tradesHaveBeenRejected });
      })
      .catch(toast.error);
  }

  function rejectSelectedItems() {
    const rejectMethods = trades
      .filter((t) => t.selected && t.item.trade_status === 'negotiate')
      .map((t) => tradeService.reject(t.item.id));

    let newPage: number;
    if (trades.length > rejectMethods.length) {
      newPage = page;
    } else {
      newPage = page === Math.ceil(count / 10) && page !== 1 ? page - 1 : page;
    }

    Promise.all(rejectMethods)
      .then(() => {
        retrieveTrades(newPage);
        toast.success({ toastKey: toastMessages.tradesHaveBeenRejected });
      })
      .catch(toast.error);
  }

  function acceptAll() {
    const acceptMethods = trades
      .filter((t) => t.item.trade_status === 'negotiate')
      .map((t) => tradeService.accept(t.item.id));

    Promise.all(acceptMethods)
      .then(() => {
        retrieveTrades(1);
        toast.success({ toastKey: toastMessages.tradesHaveBeenAccepted });
      })
      .catch(toast.error);
  }

  function acceptSelectedItems() {
    const acceptMethods = trades
      .filter((t) => t.selected && t.item.trade_status === 'negotiate')
      .map((t) => tradeService.accept(t.item.id));

    let newPage: number;
    if (trades.length > acceptMethods.length) {
      newPage = page;
    } else {
      newPage = page === Math.ceil(count / 10) && page !== 1 ? page - 1 : page;
    }

    Promise.all(acceptMethods)
      .then(() => {
        retrieveTrades(newPage);
        toast.success({ toastKey: toastMessages.tradesHaveBeenAccepted });
      })
      .catch(toast.error);
  }

  const actions: TableActions = [
    {
      text: t('trades.actions.acceptAllButtonText'),
      onClick: acceptAll,
    },
    {
      text: t('trades.actions.rejectAllButtonText'),
      onClick: rejectAll,
      color: 'error',
    },
    {
      text: t('trades.actions.rejectSelectedItems'),
      onClick: rejectSelectedItems,
      disabled: everythingIsUnselected,
    },
    {
      text: t('trades.actions.acceptSelectedItems'),
      onClick: acceptSelectedItems,
      disabled: everythingIsUnselected,
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      retrieveTrades(1);
    }
  }, [user.user_id, isAuthenticated]);

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <CardflowTabs />
      <PageHeader heading={t('trades.title')}>
        <Button startIcon={<AddIcon />} color="success" variant="outlined" href="/accounts/search">
          {t('trades.newTradeButtonText')}
        </Button>
      </PageHeader>
      <div className="flex flex-col lg:items-center overflow-auto">
        <MarketTable
          page={page}
          onPageChange={retrieveTrades}
          count={count}
          className="w-full rounded-md mt-4 lg:w-10/12 text-left"
        >
          <thead>
            <tr className="text-center">
              <th>
                <Checkbox checked={checkedAll} onChange={handleCheckAll} color="info" />
              </th>
              <th>{t('trades.table.tableHeaders.tradeNumber')}</th>
              <th>{t('trades.table.tableHeaders.user')}</th>
              <th>{t('trades.table.tableHeaders.status')}</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr key={trade.item.id}>
                <td className="w-[100px]" style={{ paddingLeft: 16, paddingRight: 16 }}>
                  <Checkbox
                    onChange={() => {
                      handleCheck(i);
                    }}
                    checked={trades[i].selected && trades[i].item.trade_status === 'negotiate'}
                    color="info"
                    disabled={trades[i].item.trade_status !== 'negotiate'}
                  />
                </td>
                <td>
                  <Link
                    href={`/trade/${trade.item.id}`}
                    sx={{
                      color: '#0B70E5',
                      textDecorationColor: '#0B70E5',
                    }}
                    underline="hover"
                  >
                    TR-{trade.item.id}
                  </Link>
                </td>
                <td>{determineOtherUser(trade.item, user.user_id).username}</td>
                <td>
                  {t(`trades.status.${trade.item.trade_status}`, {
                    context: determineDecisionContext(trade.item, user.user_id),
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </MarketTable>
        <TableActionsMenu
          actions={actions}
          selectedItemsCount={
            trades.filter((t) => t.selected && t.item.trade_status === 'negotiate').length
          }
          itemsCountTranslationKey="trades.actions.selectedItems"
          itemsCountNamespace="trade"
        />
      </div>
    </section>
  );
}

function determineDecisionContext(trade: Trade, userId: number): 'current' | 'other' {
  const currentUserDecision =
    trade.initiator.id === userId ? trade.initiator_decision : trade.recipient_decision;

  if (currentUserDecision === 'pending') {
    return 'current';
  }

  return 'other';
}

function determineOtherUser(trade: Trade, userId: number): TradeParticipant {
  if (trade.initiator.id === userId) {
    return trade.recipient;
  }

  return trade.initiator;
}

export default MyTrades;
