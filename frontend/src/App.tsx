import { useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';

function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#000',
          },
          secondary: {
            main: '#15B58D',
          },
          info: {
            main: '#000',
          },
          text: {
            primary: '#000',
            secondary: '#666666',
          },
          warning: {
            main: '#F73378',
          },
        },
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
