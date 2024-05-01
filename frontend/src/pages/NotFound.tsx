import {
  Button,
  CssBaseline,
  Divider,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import Navigation from '../components/navigation/Navigation';
import { linkBehaviorConfiguration } from '../linkBehaviorConfiguration';
import { useMemo } from 'react';

function NotFound(): JSX.Element {
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
        ...linkBehaviorConfiguration,
      }),
    [],
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <main className="flex flex-grow justify-center">
          <section className="flex items-center justify-center flex-col text-center gap-8">
            <div className="flex items-center justify-center gap-4">
              <h1 className="text-2xl md:text-3xl lg:text-5xl">404</h1>
              <Divider orientation="vertical" flexItem />
              <Typography component="p">This page could not be found</Typography>
            </div>
            <Button
              sx={{ width: 250, margin: '0 auto' }}
              variant="contained"
              color="primary"
              href="/"
            >
              Back to home page
            </Button>
          </section>
        </main>
      </ThemeProvider>
    </>
  );
}

export default NotFound;
