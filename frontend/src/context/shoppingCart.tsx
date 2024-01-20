import { Reducer, createContext, useContext, useReducer } from 'react';
import { YugiohCardListing } from '../services/yugioh/types';

type ShoppingCartContextType = {
  shoppingCart: YugiohCardListing[];
  removeListing: (listingId: number) => void;
  addListing: (listing: YugiohCardListing) => void;
  changeListingQuantity: (listingId: number, quantity: number) => void;
  loadListings: () => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({} as ShoppingCartContextType);

type CartReducerAction = {
  type: 'add' | 'delete' | 'changeQuantity' | 'load';
  listing?: YugiohCardListing;
  listingId?: number;
  quantity?: number;
  listings?: YugiohCardListing[];
};

function cartReducer(
  state: YugiohCardListing[],
  action: CartReducerAction,
): React.ReducerState<Reducer<typeof state, typeof action>> {
  switch (action.type) {
    case 'add':
      return [...state, action.listing!];
    case 'delete':
      const listings = state.filter((s) => s.id !== action.listingId);
      return listings;
    case 'changeQuantity':
      const listingsForChangeQuantity = [...state];
      listingsForChangeQuantity[action?.listingId || 0].quantity = action.quantity || 0;
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
  function addListing(listing: YugiohCardListing) {
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
    const listings: YugiohCardListing[] = listingsJSON ? JSON.parse(listingsJSON) : [];
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
