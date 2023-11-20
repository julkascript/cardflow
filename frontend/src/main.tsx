import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './router/Router.tsx';
import { UserContextProvider } from './context/user/user.tsx';
// import Router from './router/Router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  </React.StrictMode>,
);
