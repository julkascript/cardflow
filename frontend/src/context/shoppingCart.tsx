import { createContext, useContext, useState } from 'react';

type ShoppingCartContextType = {
  shoppingCart: number;
  setShoppingCart: (items: number) => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  shoppingCart: 0,
} as unknown as ShoppingCartContextType);

export function ShoppingCartContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [shoppingCart, setShoppingCart] = useState(0);

  return (
    <ShoppingCartContext.Provider
      value={{
        shoppingCart,
        setShoppingCart,
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
