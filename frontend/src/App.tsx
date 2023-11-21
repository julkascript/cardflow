import { useEffect, useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { linkBehaviorConfiguration } from './linkBehaviorConfiguration';
import { userService } from './services/user/userService';
import { useCurrentUser } from './context/user/user';
import { HttpError } from './util/HttpError';

function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#000',
          },
          secondary: {
            main: '#666666',
          },
          info: {
            main: '#4CC7FF',
          },
          text: {
            primary: '#000',
            secondary: '#666666',
          },
          error: {
            main: '#D9242C',
            light: '#FFF0F0',
          },
          warning: {
            main: '#F1AC5B',
          },
          success: {
            main: '#15B58D',
            dark: 'rgba(21, 181, 141, 0.2)',
          },
          grey: {
            '900': '#6F6F6F',
          },
        },
        ...linkBehaviorConfiguration,
      }),
    [],
  );

  const { setUser, restartUser } = useCurrentUser();

  useEffect(() => {
    userService
      .verifySession(localStorage.getItem('refreshToken'))
      .then((jwt) => {
        const user = userService.extractUserFromToken(jwt);
        setUser(user);
        localStorage.setItem('accessToken', jwt);
      })
      .catch((res) => {
        if (res instanceof HttpError && res.err.status < 500) {
          restartUser();
        }
      });
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <main></main>
        <main>
          <Outlet />
        </main>
      </ThemeProvider>
    </>
  );
}

export default App;
