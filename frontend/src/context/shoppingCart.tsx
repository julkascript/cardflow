import { Reducer, createContext, useContext, useReducer } from 'react';
import { ShoppingCardListing } from '../services/yugioh/types';

type ShoppingCartContextType = {
  shoppingCart: ShoppingCardListing[];
  removeListing: (listingId: number) => void;
  addListing: (listing: ShoppingCardListing) => void;
  changeListingQuantity: (listingId: number, quantity: number) => void;
  loadListings: () => void;
  removeAll: () => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  shoppingCart: [],
} as unknown as ShoppingCartContextType);

type CartReducerAction = {
  type: 'add' | 'delete' | 'changeQuantity' | 'load' | 'deleteAll';
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
      const currentListingIndex = state.findIndex(
        (item) => item.listing.id === action?.listing?.listing.id,
      );

      if (currentListingIndex !== -1 && action.listing) {
        const updatedListings = [...state];
        updatedListings[currentListingIndex] = action.listing;
        return updatedListings;
      }

      return [...state, action.listing!];
    case 'delete':
      const listings = state.filter((s) => s.listing.id !== action.listingId);
      return listings;
    case 'changeQuantity':
      const listingsForChangeQuantity = [...state];

      const listingIndex = state.findIndex((item) => item.listing.id === action.listingId);
      if (listingIndex === -1) {
        return state;
      }

      listingsForChangeQuantity[listingIndex].boughtQuantity = action.quantity || 0;
      return listingsForChangeQuantity;
    case 'load':
      return action?.listings || [];
    case 'deleteAll':
      return [];
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

  function removeAll() {
    dispatch({ type: 'deleteAll' });
  }

  function loadListings() {
    const listingsJSON = localStorage.getItem('cart');
    const listings: ShoppingCardListing[] = listingsJSON ? JSON.parse(listingsJSON) : [];
    dispatch({ type: 'load', listings });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        shoppingCart,
        addListing,
        removeListing,
        changeListingQuantity,
        loadListings,
        removeAll,
      }}
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
