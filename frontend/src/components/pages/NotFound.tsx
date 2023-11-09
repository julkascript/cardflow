import { Button, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import Navigation from '../navigation/Navigation';
import { linkBehaviorConfiguration } from '../../linkBehaviorConfiguration';
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
        <main>
          <section className="flex justify-center flex-col text-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-5xl">
              The page you are looking for does not exist!
            </h1>
            <Typography color="text.secondary" component="p">
              Make sure that you have spelled the address correctly
            </Typography>
            <Button
              sx={{ width: 250, margin: '0 auto' }}
              variant="contained"
              color="primary"
              href="/"
              className="margin-center"
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
