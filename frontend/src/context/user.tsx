import React, { useContext, useState } from 'react';
import { CurrentUser } from '../services/user/types';

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
  },
  setUser(user) {
    this.user = user;
  },
  restartUser() {
    this.user = {
      user_id: 0,
      username: '',
      email: '',
    };
  },
});

export function UserContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<CurrentUser>({
    user_id: 0,
    username: '',
    email: '',
  });

  function restartUser() {
    setUser({
      user_id: 0,
      username: '',
      email: '',
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
