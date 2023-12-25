import { useEffect, useState } from 'react';

/**
 * This hook is effectively an ``useEffect`` that
 * triggers on every rerender except the first one.
 * @param callback
 * @param dependencies
 * @returns
 */
export const useEffectAfterInitialLoad = (
  callback: React.EffectCallback,
  dependencies?: React.DependencyList,
): void => {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state) {
      return callback();
    } else {
      setState(true);
    }
  }, dependencies);
};
