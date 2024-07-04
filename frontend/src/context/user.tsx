import React, { useContext, useState } from 'react';
import { CurrentUser } from '../services/user/types';
import { defaultCurrency } from '../constants/currencies';

type CurrentUserContext = {
  user: CurrentUser;
  setUser: (user: CurrentUser) => void;
  restartUser: () => void;
};

const UserContext = React.createContext<CurrentUserContext>({
  user: {
    user_id: 0,
    email: '',
    username: '',
    shipping_address: '',
    first_name: null,
    last_name: null,
    phone_number: null,
    city: null,
    avatar: null,
    currency_preference: defaultCurrency,
  },
  setUser(user) {
    this.user = user;
  },
  restartUser() {
    this.user = {
      user_id: 0,
      username: '',
      email: '',
      shipping_address: null,
      first_name: null,
      last_name: null,
      phone_number: null,
      city: null,
      avatar: null,
      currency_preference: defaultCurrency,
    };
  },
});

export function UserContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<CurrentUser>({
    user_id: 0,
    username: '',
    email: '',
    shipping_address: null,
    first_name: null,
    last_name: null,
    phone_number: null,
    city: null,
    avatar: null,
    currency_preference: defaultCurrency,
  });

  function restartUser() {
    setUser({
      user_id: 0,
      username: '',
      email: '',
      shipping_address: null,
      first_name: null,
      last_name: null,
      phone_number: null,
      city: null,
      avatar: null,
      currency_preference: defaultCurrency,
    });
  }

  return (
    <UserContext.Provider value={{ user, setUser, restartUser }}>{children}</UserContext.Provider>
  );
}

/**
 * A hook that lets you read and manage the current user's data
 * @returns an object with the user's data, a setter for the data, and a method to
 * set the user's data to the default state.
 */
export const useCurrentUser = () => {
  const currentUser = useContext(UserContext);
  return currentUser;
};

export const useAuthenticationStatus = () => {
  const { user } = useCurrentUser();

  const isAuthenticated = user.user_id !== 0;
  return { isAuthenticated };
};
