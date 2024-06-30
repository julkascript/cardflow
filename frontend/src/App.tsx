import { useEffect, useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { userService } from './services/user/user';
import { useCurrentUser } from './context/user';
import { HttpError } from './util/HttpError';
import { useShoppingCart } from './context/shoppingCart';
import { shoppingCartService } from './services/shoppingCart/shoppingCart';
import { Toaster } from 'react-hot-toast';
import { theme } from './constants/theme';
import { linkBehaviorConfiguration } from './linkBehaviorConfiguration';
import { useToast } from './util/useToast';
import * as locales from '@mui/material/locale';
import i18next from 'i18next';

const languages: { [key: string]: any } = {
  bg: locales.bgBG,
  en: locales.enUS,
};

function App() {
  const appTheme = useMemo(
    () =>
      createTheme(
        { ...theme, ...linkBehaviorConfiguration },
        languages[i18next.language] || locales.enUS,
      ),
    [i18next.language],
  );

  const { setUser, restartUser } = useCurrentUser();
  const { setShoppingCart } = useShoppingCart();
  const toast = useToast();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (refreshToken && accessToken) {
      userService
        .verifySession(refreshToken)
        .then(async (jwt) => {
          localStorage.setItem('accessToken', jwt);
          const { user_id } = userService.extractUserFromToken(jwt);
          const user = await userService.getUserById(user_id);

          setUser({ user_id, ...user });
          return shoppingCartService.getItems(undefined, 1);
        })
        .then((data) => {
          setShoppingCart(data.count);
        })
        .catch((res) => {
          if (res instanceof HttpError && res.err.status < 500) {
            restartUser();
          } else if (res instanceof HttpError) {
            toast.error({ error: res });
          }
        });
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Navigation />
        <main className="min-h-full">
          <Outlet />
        </main>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: theme.palette.success.main,
                color: 'white',
              },
            },
            error: {
              style: {
                background: theme.palette.error.main,
                color: 'white',
              },
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
