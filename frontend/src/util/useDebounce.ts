import { useEffect, useMemo, useRef } from 'react';

/**
 * @param callback the function to be executed.
 * @param timeout expressed in miliseconds, defaults to 500
 */
function debounce<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout = 500,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

/**
 * A hook for debouncing functions. When called, the passed callback
 * will be called after ``timeout`` miliseconds pass, provided that the function
 * is not called again before that.
 * @param callback the function to be executed
 * @param timeout expressed in miliseconds, defaults to 500
 */
export const useDebounce = (callback: (...args: any[]) => void, timeout = 500) => {
  const ref = useRef<(...args: any[]) => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args);
    };
    return debounce(func, timeout);
  }, []);

  return debouncedCallback;
};
