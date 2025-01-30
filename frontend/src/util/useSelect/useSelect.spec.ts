import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSelect } from './useSelect';

const sampleData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('useSelect', () => {
  describe('set', () => {
    it('Populates data correctly', () => {
      const select = renderHook(() => useSelect<number>()).result;
      expect(select.current.data).toHaveLength(0);

      act(() => select.current.set(sampleData));

      expect(select.current.data).toHaveLength(sampleData.length);
      expect(select.current.data.every((d) => !d.selected)).toBe(true);
    });

    it('Sets checkedAll to false', () => {
      const select = renderHook(() => useSelect<number>()).result;
      act(() => select.current.set(sampleData));
      act(() => select.current.handleCheckAll());

      act(() => select.current.set(sampleData));
      expect(select.current.checkedAll).toBe(false);
    });
  });

  describe('check methods', () => {
    it('Correctly checks a single item', () => {
      const select = renderHook(() => useSelect<number>()).result;

      act(() => select.current.set(sampleData));

      act(() => select.current.handleCheck(3));

      expect(select.current.data[3].selected).toBe(true);

      act(() => select.current.handleCheck(3));

      expect(select.current.data[3].selected).toBe(false);
    });

    it('Correctly handles a check all event if checkedAll is false', () => {
      const select = renderHook(() => useSelect<number>()).result;
      act(() => select.current.set(sampleData));
      expect(select.current.checkedAll).toBe(false);

      act(() => select.current.handleCheckAll());
      expect(select.current.checkedAll).toBe(true);
      expect(select.current.data.every((d) => d.selected)).toBe(true);
    });

    it('Correctly handles a check all event if at least one item is unchecked', () => {
      const select = renderHook(() => useSelect<number>()).result;

      act(() => select.current.set(sampleData));

      // Ensure that checkedAll is false
      act(() => select.current.handleCheckAll());
      act(() => select.current.handleCheck(2));
      expect(select.current.checkedAll).toBe(false);

      act(() => select.current.handleCheckAll());

      expect(select.current.data.every((d) => d.selected)).toBe(true);
    });

    it('Correctly handles a check all event if all items are checked', () => {
      const select = renderHook(() => useSelect<number>()).result;

      act(() => select.current.set(sampleData));
      act(() => select.current.handleCheckAll());
      act(() => select.current.handleCheckAll());

      expect(select.current.data.every((d) => !d.selected)).toBe(true);
    });
  });
});
