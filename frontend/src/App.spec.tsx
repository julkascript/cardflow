import { describe, it } from 'vitest';
import { screen, render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('works', async () => {
    render(<App></App>);
    await screen.findByText(/Vite and React/i);
  });
});
