import * as React from "react";
import {SortDirection} from "@dccs/react-table-mui";
import {OnLoadData} from ".";
import {IParams} from "./IParams";
import {PropType} from "@dccs/react-table-mui/lib/IColDef";

export interface IDataState<T extends object, F extends object> extends IParams<T, F> {
  setTotal: (total: number) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rpp: number) => void;
  setOrderBy: (orderBy: PropType<T>) => void;
  setSort: (sort: SortDirection | undefined) => void;
  setFilter: (filter: F | undefined) => void;
  setFilterProp: (key: keyof F, value: any) => void;
  allowLoad: boolean;
  setAllowLoad: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
  data: T[];
  reload: () => void;

  handleChangePage(p: number): void;

  handleChangeRowsPerPage(rows: number): void;

  handleChangeOrderBy(ob: PropType<T>): void;

  handleChangeFilter(ob: PropType<T>, value: any): void;

  load(): void;

  // Vorerst noch nicht von außen änderbar
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // setError: React.Dispatch<React.SetStateAction<boolean>>;
  // setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface IPersistState {
  store: "localStorage" | "sessionStorage";
  uniqueID: string;
}

export interface IUseDataStateProps<T extends object, F extends object> {
  onLoadData: OnLoadData<T, F>;
  initialRowsPerPage?: number;
  initialOrderBy?: PropType<T>;
  initialSort?: SortDirection;
  initialLoad?: boolean;
  initialPage?: number;
  initialFilter?: F;
  persistState?: IPersistState;
}

function getStateFromStore<T extends object, F extends object>(props?: IUseDataStateProps<T, F>) {
  if (props && props.persistState && props.persistState.uniqueID) {
    if (props.persistState.store === "localStorage") {
      const state = localStorage.getItem(props.persistState.uniqueID);

      if (state) {
        return JSON.parse(state) as IDataState<T, F>;
      }
    } else if (props.persistState.store === "sessionStorage") {
      const state = sessionStorage.getItem(props.persistState.uniqueID);

      if (state) {
        return JSON.parse(state) as IDataState<T, F>;
      }
    }
  }

  return undefined;
}

export function useDataState<T extends object, F extends object>(props: IUseDataStateProps<T, F>) {
  const stateFromStore = getStateFromStore(props);

  const [rowsPerPage, _setRowsPerPage] = React.useState(
    (stateFromStore && stateFromStore.rowsPerPage) ||
    (props && props.initialRowsPerPage) ||
    10
  );
  const [page, setPage] = React.useState(
    (stateFromStore && stateFromStore.page) || (props && props.initialPage) || 0
  );
  const [total, setTotal] = React.useState(
    (stateFromStore && stateFromStore.total) || 0
  );
  const [orderBy, setOrderBy] = React.useState<PropType<T> | undefined>(
    (stateFromStore && stateFromStore.orderBy) ||
    (props && props.initialOrderBy)
  );
  const [sort, setSort] = React.useState<SortDirection | undefined>(
    (stateFromStore && stateFromStore.sort) || (props && props.initialSort)
  );
  const [filter, setFilter] = React.useState<F | undefined>((stateFromStore && stateFromStore.filter) || props.initialFilter);

  // Always use initial here? not sure
  const [allowLoad, setAllowLoad] = React.useState(
    !(props && props.initialLoad === false)
  );

  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [reloadDummy, setReload] = React.useState(false);

  const reload = () => {
    setReload(!reloadDummy);
  };

  function setFilterProp(key: keyof F, value: any) {
    setFilter(f => ({...f!, [key]: value}))
  }

  function handleChangePage(p: number) {
    setPage(p);
  }

  function handleChangeRowsPerPage(rows: number) {
    setRowsPerPage(rows);
  }

  function handleChangeOrderBy(ob: PropType<T>) {
    let s: SortDirection | undefined;

    if (orderBy && orderBy === ob) {
      s = sort === "desc" ? "asc" : "desc";
    }

    setOrderBy(ob);
    setSort(s);
  }

  function handleChangeFilter(ob: PropType<T>, value: any) {
    setFilter(f => ({...f!, [ob]: value}));
  }

  function setRowsPerPage(count: number) {
    setPage(0); // reset to first page.
    _setRowsPerPage(count);
  }

  React.useEffect(() => {
    if (allowLoad) {
      load();
    } else {
      // allowLoad on second try.
      setAllowLoad(true);
    }
  }, [
    rowsPerPage,
    page,
    orderBy,
    sort === "desc",
    reloadDummy,
    // Why JSON.stringify?
    // The way the useEffect dependency array works is by checking for strict (===) equivalency between all of the items in the array from the previous render and the new render.
    // Example:  {}==={}                                   -> false -> different -> rerender
    // Example2: JSON.stringify({}) === JSON.stringify({}) -> true  -> same      -> no rerender
    JSON.stringify(filter),
  ]);

  function load() {
    if (props.onLoadData) {
      setLoading(true);
      setError(false);

      props
        .onLoadData(page + 1, rowsPerPage, orderBy, sort, filter)
        .then(({data: d, total: t}) => {
          setTotal(t);
          setData(d);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
    }
  }

  const state: IDataState<T, F> = {
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    total,
    setTotal,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    filter,
    setFilter,
    setFilterProp,
    allowLoad,
    setAllowLoad,
    data,
    loading,
    error,
    reload,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeOrderBy,
    handleChangeFilter,
    load,
  };

  React.useEffect(() => {
    if (props && props.persistState && props.persistState.uniqueID) {
      if (props.persistState.store === "localStorage") {
        localStorage.setItem(
          props.persistState.uniqueID,
          JSON.stringify(state)
        );
      } else if (props.persistState.store === "sessionStorage") {
        sessionStorage.setItem(
          props.persistState.uniqueID,
          JSON.stringify(state)
        );
      }
    }
  }, [state]);

  return state;
}
