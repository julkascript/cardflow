import { useReducer, useState } from 'react';

type SelectData<T> = {
  item: T;
  selected: boolean;
};

type selectReducer = {
  type: 'select';
  index: number;
};

type selectAllReducer = {
  type: 'selectAll';
};

type deselectReducer = {
  type: 'deselect';
  index: number;
};

type deselectAllReducer = {
  type: 'deselectAll';
};

type setReducer<T> = {
  type: 'set';
  collection: SelectData<T>[];
};

type SelectAction<T> =
  | selectReducer
  | selectAllReducer
  | deselectReducer
  | deselectAllReducer
  | setReducer<T>;

function reducer<T>(
  state: SelectData<T>[],
  action: SelectAction<T>,
): React.ReducerState<React.Reducer<typeof state, typeof action>> {
  switch (action.type) {
    case 'set':
      return action.collection;
    case 'select':
      const itemsToSelect = [...state];
      itemsToSelect[action.index].selected = true;
      return itemsToSelect;
    case 'selectAll':
      return state.map((allItemsSelect) => ({ ...allItemsSelect, selected: true }));
    case 'deselect':
      const itemsToDeselect = [...state];
      itemsToDeselect[action.index].selected = false;
      return itemsToDeselect;
    case 'deselectAll':
      return state.map((allItemsDeselect) => ({ ...allItemsDeselect, selected: false }));
  }
}

/**
 * A hook to handle selected state of a collection. Example use cases within
 * the app include the sell management page and the user's trades page.
 *
 * The hook works with arrays of any type.
 * @returns
 */
export function useSelect<T>() {
  const [data, dispatch] = useReducer<React.Reducer<SelectData<T>[], SelectAction<T>>>(
    reducer,
    [] as SelectData<T>[],
  );

  const [checkedAll, setCheckedAll] = useState(false);

  function restartCheckedAll() {
    setCheckedAll(false);
  }

  function handleCheck(index: number) {
    if (data[index].selected) {
      setCheckedAll(false);
    }

    dispatch({
      type: data[index].selected ? 'deselect' : 'select',
      index,
    });
  }

  function handleCheckAll() {
    if (checkedAll) {
      if (data.some((d) => !d.selected)) {
        dispatch({ type: 'selectAll' });
      } else {
        dispatch({ type: 'deselectAll' });
        setCheckedAll(false);
      }
    } else {
      dispatch({ type: 'selectAll' });
      setCheckedAll(true);
    }
  }

  function set(items: T[]) {
    const collection: SelectData<T>[] = items.map((item) => ({
      item,
      selected: false,
    }));

    dispatch({ type: 'set', collection });
    setCheckedAll(false);
  }

  return {
    data,
    handleCheck,
    handleCheckAll,
    set,

    /**
     * This is used to handle a few edge cases regarding the "check all" checkbox.
     * Use this to control the checkbox's checked state.
     */
    checkedAll,
    restartCheckedAll,
  };
}
