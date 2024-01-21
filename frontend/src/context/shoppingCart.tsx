import { Reducer, createContext, useContext, useReducer } from 'react';
import { ShoppingCardListing } from '../services/yugioh/types';

type ShoppingCartContextType = {
  shoppingCart: ShoppingCardListing[];
  removeListing: (listingId: number) => void;
  addListing: (listing: ShoppingCardListing) => void;
  changeListingQuantity: (listingId: number, quantity: number) => void;
  loadListings: () => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  shoppingCart: [],
} as unknown as ShoppingCartContextType);

type CartReducerAction = {
  type: 'add' | 'delete' | 'changeQuantity' | 'load';
  listing?: ShoppingCardListing;
  listingId?: number;
  quantity?: number;
  listings?: ShoppingCardListing[];
};

function cartReducer(
  state: ShoppingCardListing[],
  action: CartReducerAction,
): React.ReducerState<Reducer<typeof state, typeof action>> {
  switch (action.type) {
    case 'add':
      return [...state, action.listing!];
    case 'delete':
      const listings = state.filter((s) => s.listing.id !== action.listingId);
      return listings;
    case 'changeQuantity':
      const listingsForChangeQuantity = [...state];
      listingsForChangeQuantity[action?.listingId || 0].listing.quantity = action.quantity || 0;
      return listingsForChangeQuantity;
    case 'load':
      return action?.listings || [];
  }
}

export function ShoppingCartContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [shoppingCart, dispatch] = useReducer(cartReducer, []);
  function addListing(listing: ShoppingCardListing) {
    dispatch({ type: 'add', listing });
  }

  function removeListing(listingId: number) {
    dispatch({ type: 'delete', listingId });
  }

  function changeListingQuantity(listingId: number, quantity: number) {
    dispatch({ type: 'changeQuantity', listingId, quantity });
  }

  function loadListings() {
    const listingsJSON = localStorage.getItem('cart');
    const listings: ShoppingCardListing[] = listingsJSON ? JSON.parse(listingsJSON) : [];
    dispatch({ type: 'load', listings });
  }

  return (
    <ShoppingCartContext.Provider
      value={{ shoppingCart, addListing, removeListing, changeListingQuantity, loadListings }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

/**
 * @returns properties and methods for managing the shopping cart context.
 */
export const useShoppingCart = () => {
  const shoppingCart = useContext(ShoppingCartContext);
  return shoppingCart;
};
