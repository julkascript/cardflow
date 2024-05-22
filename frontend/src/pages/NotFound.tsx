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
import { theme } from '../constants/theme';

function NotFound(): JSX.Element {
  const appTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        ...linkBehaviorConfiguration,
      }),
    [],
  );

  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Navigation />
        <main className="flex flex-grow justify-center">
          <section className="flex items-center justify-center flex-col text-center gap-4 lg:gap-8">
            <div className="flex items-center flex-col lg:flex-row justify-center lg:gap-4">
              <h1 className="text-2xl md:text-3xl lg:text-5xl mb-0 pb-0">404</h1>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderRight: 3, borderColor: 'gray' }}
                className="hidden lg:block"
              />
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
