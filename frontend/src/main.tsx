import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './router/Router.tsx';
import { UserContextProvider } from './context/user.tsx';
import { ShoppingCartContextProvider } from './context/shoppingCart.tsx';
// import Router from './router/Router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <ShoppingCartContextProvider>
        <Router />
      </ShoppingCartContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
);
