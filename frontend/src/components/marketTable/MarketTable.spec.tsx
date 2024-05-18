import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MarketTable from './MarketTable';

describe('MarketTable', () => {
  it('Pagination works correctly with one-based indices', async () => {
    const mockPageChangeHandler = vi.fn();
    render(
      <MarketTable page={4} onPageChange={mockPageChangeHandler} count={100}>
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </MarketTable>,
    );

    const nextPage = await screen.findByLabelText(/Go to next page/i);
    act(() => nextPage.click());

    expect(mockPageChangeHandler).toHaveBeenCalledWith(5);
  });

  it('Does not render the pagination if the pagination props are not passed', () => {
    render(
      <MarketTable>
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </MarketTable>,
    );

    const pagination = document.querySelector('.table-pagination');
    expect(pagination).toBeNull();
  });
});
