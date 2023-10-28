import { useMemo } from 'react';
import './App.css';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
function App() {
  /*
    TO-DO: configure primary and secondary colors based on
    wireframes
  */
  const theme = useMemo(() => createTheme(), []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main></main>
      </ThemeProvider>
    </>
  );
}

export default App;
