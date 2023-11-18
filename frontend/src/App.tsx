import { useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { linkBehaviorConfiguration } from './linkBehaviorConfiguration';

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
        },
        ...linkBehaviorConfiguration,
      }),
    [],
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <main>
          <Outlet />
        </main>
      </ThemeProvider>
    </>
  );
}

export default App;
