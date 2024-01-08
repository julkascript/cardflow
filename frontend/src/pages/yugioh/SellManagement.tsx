import { Button, Checkbox, Link, Menu, MenuItem } from '@mui/material';
import MarketTable from '../../components/marketTable/MarketTable';
import { YugiohCardListing } from '../../services/yugioh/types';
import React, { Reducer, useEffect, useReducer } from 'react';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useAuthenticationStatus, useCurrentUser } from '../../context/user';
import YugiohCardConditionLabel from '../../components/yugioh/YugiohCardConditionLabel';

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
    dispatch({
      type: data.every((d) => d.selected) ? 'deselectAll' : 'selectAll',
    });
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

  useEffect(() => {
    if (isAuthenticated) {
      retrieveListings();
    }
  }, [user.user_id]);
  return (
    <section>
      <MarketTable>
        <thead>
          <tr>
            <th>
              <Checkbox onChange={handleCheckAll} color="default" />
            </th>
            <th colSpan={2}>Card details</th>
            <th>Available</th>
            <th>Price</th>
            <th>Listed</th>
          </tr>
          {data.map((ld, i) => (
            <tr key={ld.listing.id}>
              <td>
                <Checkbox
                  onChange={() => {
                    handleCheck(i);
                  }}
                  checked={data[i].selected}
                />
              </td>
              <td>
                <Link>{ld.listing.card_name}</Link>
              </td>
              <td>
                <YugiohCardConditionLabel condition={ld.listing.condition} />
              </td>
              <td>{ld.listing.quantity}</td>
              <td>$&nbsp;{ld.listing.price}</td>
              <td>{ld.listing.is_listed.toString()}</td>
            </tr>
          ))}
        </thead>
      </MarketTable>
      <div>
        <p>{data.filter((d) => d.selected).length} item(s) selected</p>
        <div>
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
            <MenuItem>Unlist selected items</MenuItem>
            <MenuItem>List selected items</MenuItem>
            <MenuItem>List all</MenuItem>
          </Menu>
        </div>
      </div>
    </section>
  );
}

export default SellManagement;
