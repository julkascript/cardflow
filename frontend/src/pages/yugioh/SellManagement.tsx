import { Button, Checkbox, IconButton, Link, Menu, MenuItem } from '@mui/material';
import MarketTable from '../../components/marketTable/MarketTable';
import { YugiohCardListing } from '../../services/yugioh/types';
import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useAuthenticationStatus, useCurrentUser } from '../../context/user';
import YugiohCardConditionLabel from '../../components/yugioh/YugiohCardConditionLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageHeader from '../../components/PageHeader';
import LensIcon from '@mui/icons-material/Lens';
import AddIcon from '@mui/icons-material/Add';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import { toastMessages } from '../../constants/toast';
import { useToast } from '../../util/useToast';

type ListingData = {
  listing: YugiohCardListing;
  selected: boolean;
};

type selectReducerAction = {
  type: 'select' | 'deselect' | 'set' | 'selectAll' | 'deselectAll';
  index?: number;
  checked?: boolean;
  newListings?: ListingData[];
};

function selectReducer(
  state: ListingData[],
  action: selectReducerAction,
): React.ReducerState<Reducer<typeof state, typeof action>> {
  switch (action.type) {
    case 'select':
      const listingsForSelect = [...state];
      listingsForSelect[action.index || 0].selected = true;
      return listingsForSelect;
    case 'deselect':
      const listingsForDeselect = [...state];
      listingsForDeselect[action.index || 0].selected = false;
      return listingsForDeselect;
    case 'set':
      return action.newListings || [];
    case 'selectAll':
      return state.map((ld) => ({ ...ld, selected: true }));
    case 'deselectAll':
      return state.map((ld) => ({ ...ld, selected: false }));
    default:
      throw new Error('Unknown action');
  }
}

function SellManagement(): JSX.Element {
  const [data, dispatch] = useReducer(selectReducer, [] as ListingData[]);
  const { user } = useCurrentUser();
  const { isAuthenticated } = useAuthenticationStatus();
  const [checkedAll, setCheckedAll] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const toast = useToast();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  }

  function closeMenu(event: React.MouseEvent) {
    event.preventDefault();
    setAnchorEl(null);
  }

  function retrieveListings(page: number) {
    yugiohService
      .getCardListingsByUserId(user.user_id, page)
      .then((listings) => {
        const data: ListingData[] = listings.results.map((l) => ({
          listing: l,
          selected: false,
        }));

        setCount(listings.count);

        dispatch({
          type: 'set',
          newListings: data,
        });

        setCheckedAll(false);
        setPage(page);
      })
      .catch((error) => toast.error({ error }));
  }

  function handleCheck(index: number) {
    if (data[index].selected) {
      setCheckedAll(false);
    }

    dispatch({
      type: data[index].selected ? 'deselect' : 'select',
      index,
    });
  }

  function handleCheckAll() {
    if (checkedAll) {
      if (data.some((d) => !d.selected)) {
        dispatch({ type: 'selectAll' });
      } else {
        dispatch({ type: 'deselectAll' });
        setCheckedAll(false);
      }
    } else {
      dispatch({ type: 'selectAll' });
      setCheckedAll(true);
    }
  }

  function delistAll(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data.map((d) => {
      return yugiohService.editListing({ ...d.listing, is_listed: false });
    });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(1);
        toast.success({ toastKey: toastMessages.sellListingsDelisted });
      })
      .catch((error) => toast.error({ error }));
  }

  function listAll(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data.map((d) => {
      return yugiohService.editListing({ ...d.listing, is_listed: true });
    });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        setAnchorEl(null);
        toast.success({ toastKey: toastMessages.sellListingsListed });
      })
      .catch((error) => toast.error({ error }));
  }

  function deleteAll(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data.map((d) => {
      return yugiohService.deleteListingById(d.listing.id);
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

  function deleteSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.deleteListingById(d.listing.id);
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
        setAnchorEl(null);
      })
      .catch((error) => toast.error({ error }));
  }

  function delistSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.listing, is_listed: false });
      });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        setAnchorEl(null);
        toast.success({ toastKey: toastMessages.sellListingsDelisted });
      })
      .catch((error) => toast.error({ error }));
  }

  function listSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.listing, is_listed: true });
      });

    Promise.all(fetchFunctions)
      .then(() => {
        retrieveListings(page);
        setAnchorEl(null);
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
      <PageHeader heading="Sell">
        <div className="flex gap-4">
          <Button
            sx={{ color: '#0B70E5', borderColor: '#0B70E5', ':hover': { borderColor: '#0B70E5' } }}
            className="rounded-md"
            href={`/user/${user.username}/sales`}
            variant="outlined"
          >
            My sales
          </Button>
          <Button
            className="rounded-md"
            startIcon={<AddIcon />}
            href="/sell/new"
            variant="outlined"
            color="success"
          >
            New listing
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
              <th colSpan={2}>Card details</th>
              <th>Available</th>
              <th>Price</th>
              <th>Listed</th>
            </tr>
            {data.map((ld, i) => (
              <tr key={ld.listing.id}>
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
                    href={`/sell/listing/${ld.listing.id}/edit`}
                    sx={{
                      color: '#0B70E5',
                      textDecorationColor: '#0B70E5',
                      textDecoration: 'none',
                      ':hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {ld.listing.card_name}
                  </Link>
                </td>
                <td className="w-[110px]">
                  <YugiohCardConditionLabel
                    className="w-[110px]"
                    condition={ld.listing.condition}
                  />
                </td>
                <td className="w-48 text-center">{ld.listing.quantity}</td>
                <td className="w-48 font-bold text-center">$&nbsp;{ld.listing.price}</td>
                <td className="text-center w-4">
                  <IconButton
                    onClick={() => toggleListingVisibility(ld.listing, !ld.listing.is_listed)}
                    sx={{ color: ld.listing.is_listed ? 'blue' : 'inherit' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </thead>
        </MarketTable>
        <div className="text-center bg-white self-center mb-4 mt-4 w-96 border-[#666666] border rounded-md">
          <p className="pt-4">
            <strong>{data.filter((d) => d.selected).length}</strong> item(s) selected
          </p>
          <div className="flex justify-between p-4">
            <Button className="rounded-md" variant="outlined" onClick={delistAll}>
              Delist all
            </Button>
            <Button className="rounded-md" variant="outlined" color="error" onClick={deleteAll}>
              Delete all
            </Button>
            <Button
              className="font-bold rounded-md flex gap-1 items-center justify-center"
              variant="outlined"
              onClick={openMenu}
            >
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
            </Button>
            <Menu open={open} anchorEl={anchorEl} onClose={closeMenu}>
              <MenuItem disabled={data.every((d) => !d.selected)} onClick={deleteSelectedItems}>
                Delete selected items
              </MenuItem>
              <MenuItem disabled={data.every((d) => !d.selected)} onClick={delistSelectedItems}>
                Delist selected items
              </MenuItem>
              <MenuItem disabled={data.every((d) => !d.selected)} onClick={listSelectedItems}>
                List selected items
              </MenuItem>
              <MenuItem onClick={listAll}>List all</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellManagement;
