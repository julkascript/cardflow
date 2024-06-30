import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './router/Router.tsx';
import { UserContextProvider } from './context/user.tsx';
import { ShoppingCartContextProvider } from './context/shoppingCart.tsx';
import './i18next';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<h1>Loading</h1>}>
      <UserContextProvider>
        <ShoppingCartContextProvider>
          <Router />
        </ShoppingCartContextProvider>
      </UserContextProvider>
    </Suspense>
  </React.StrictMode>,
);
