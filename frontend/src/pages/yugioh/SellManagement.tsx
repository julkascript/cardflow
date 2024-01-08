import { Button, Checkbox, IconButton, Link, Menu, MenuItem } from '@mui/material';
import MarketTable from '../../components/marketTable/MarketTable';
import { YugiohCardListing } from '../../services/yugioh/types';
import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useAuthenticationStatus, useCurrentUser } from '../../context/user';
import YugiohCardConditionLabel from '../../components/yugioh/YugiohCardConditionLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageHeader from '../../components/PageHeader';

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

  function retrieveListings() {
    yugiohService.getCardListingsByUserId(user.user_id).then((listings) => {
      const data: ListingData[] = listings.results.map((l) => ({
        listing: l,
        selected: false,
      }));

      dispatch({
        type: 'set',
        newListings: data,
      });
    });
  }

  function handleCheck(index: number) {
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

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
    });
  }

  function listAll(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data.map((d) => {
      return yugiohService.editListing({ ...d.listing, is_listed: true });
    });

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
      setAnchorEl(null);
    });
  }

  function deleteAll(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data.map((d) => {
      return yugiohService.deleteListingById(d.listing.id);
    });

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
    });
  }

  function deleteSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.deleteListingById(d.listing.id);
      });

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
      setAnchorEl(null);
    });
  }

  function delistSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.listing, is_listed: false });
      });

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
      setAnchorEl(null);
    });
  }

  function listSelectedItems(event: React.MouseEvent) {
    event.preventDefault();
    const fetchFunctions = data
      .filter((d) => d.selected)
      .map((d) => {
        return yugiohService.editListing({ ...d.listing, is_listed: true });
      });

    Promise.all(fetchFunctions).then(() => {
      retrieveListings();
      setAnchorEl(null);
    });
  }

  function toggleListingVisibility(listing: YugiohCardListing, newStatus: boolean) {
    yugiohService.editListing({ ...listing, is_listed: newStatus }).then(() => retrieveListings());
  }
  useEffect(() => {
    if (isAuthenticated) {
      retrieveListings();
    }
  }, [user.user_id]);
  return (
    <section>
      <PageHeader heading="Sell">
        {/* TO-DO: update URL */}
        <Button href="/listing/new" variant="outlined" color="success">
          New Listing
        </Button>
      </PageHeader>
      <div className="block lg:flex flex-col items-center overflow-auto">
        <MarketTable className="w-full lg:w-10/12 text-left">
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
                  {/* TO-DO: update URL */}
                  <Link
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
                <td className="w-48 text-center">$&nbsp;{ld.listing.price}</td>
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
        <div className="text-center mb-4 mt-4 w-96 border-[#666666] border rounded">
          <p className="pt-4">
            <strong>{data.filter((d) => d.selected).length}</strong> item(s) selected
          </p>
          <div className="flex justify-between p-4">
            <Button variant="outlined" onClick={delistAll}>
              Delist all
            </Button>
            <Button variant="outlined" color="error" onClick={deleteAll}>
              Delete all
            </Button>
            <Button variant="outlined" onClick={openMenu}>
              . . .
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
