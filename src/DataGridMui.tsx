import * as React from "react";
import styled from "styled-components";
import { TablePlain } from "@dccs/react-table-plain";
import { tableMuiTheme } from "@dccs/react-table-mui";
import { IColDef } from "@dccs/react-table-plain";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Button from "@material-ui/core/Button/Button";
import ErrorIcon from "@material-ui/icons/Error";

export type OnLoadData = (
  page: number,
  rowsPerPage: number,
  orderBy: string,
  desc: boolean,
  filter: { [key: string]: any }
) => Promise<{ total: number; data: any[] }>;

interface IProps {
  colDef: IColDef[];
  initRowsPerPage?: number;
  onLoadData: OnLoadData;
  disablePaging?: boolean;
  onRowClick?: (data: any) => void;
  subComponent?: (data: any) => React.ReactNode;
}

interface IState {
  rowsPerPage: number;
  page: number;
  total: number;
  orderBy?: IColDef;
  desc: boolean;
  filter: any;
  reloadDummy: boolean;
}

export interface IDataGridStateContext {
  state: IState;
  dispatch: React.Dispatch<IAction>;
}

export const DataGridState = React.createContext<
  IDataGridStateContext | undefined
>(undefined);

type ReducerActionType =
  | "set-total"
  | "set-page"
  | "set-rowsperpage"
  | "set-orderBy"
  | "set-filter"
  | "reload";

interface IAction {
  type: ReducerActionType;
  payload: any;
}

function reducer(s: any, action: { type: ReducerActionType; payload: any }) {
  switch (action.type) {
    case "set-total":
      return { ...s, total: action.payload };
    case "set-page":
      return { ...s, page: action.payload };
    case "set-rowsperpage":
      return { ...s, rowsPerPage: action.payload };
    case "set-orderBy":
      return { ...s, ...action.payload };
    case "set-filter":
      return { ...s, filter: { ...s.filter, ...action.payload } };
    case "reload":
      return { ...s, reloadDummy: !s.reloadDummy };

    default:
      throw new Error();
  }
}

export function DataGridStateProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer<React.Reducer<IState, IAction>>(
    reducer,
    createDefaultState()
  );

  return (
    <DataGridState.Provider value={{ state, dispatch }}>
      {children}
    </DataGridState.Provider>
  );
}

export function DataGridMui(props: IProps) {
  // Do we have a custom context,...
  let stateContext = React.useContext(DataGridState);
  const privateReducer = React.useReducer<React.Reducer<IState, IAction>>(
    reducer,
    createDefaultState()
  ); // ...if not, we need to create the state.

  if (stateContext === undefined) {
    stateContext = { state: privateReducer[0], dispatch: privateReducer[1] };
  }

  const { state, dispatch } = stateContext!;
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy ? (state.orderBy! as IColDef).prop : "",
        state.desc,
        state.filter
      )
      .then(({ data: d, total }) => {
        dispatch({ type: "set-total", payload: total });
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [
    state.rowsPerPage,
    state.page,
    state.orderBy,
    state.desc,
    state.filter,
    state.reloadDummy,
    props,
    dispatch
  ]);

  function renderError() {
    return (
      <SnackbarContent
        style={{ width: "100%" }}
        message={
          <ErrorMessage>
            <ErrorIcon /> Die Daten konnten nicht geladen werden.
          </ErrorMessage>
        }
        action={
          <Button onClick={() => load()} color="primary" size="small">
            Neu laden
          </Button>
        }
      />
    );
  }

  function load() {
    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy ? (state.orderBy! as IColDef).prop : "",
        state.desc,
        state.filter
      )
      .then(({ data: d, total }) => {
        dispatch({ type: "set-total", payload: total });
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  function handleChangePage(page: number) {
    dispatch({ type: "set-page", payload: page });
  }

  function handleChangeRowsPerPage(rows: number) {
    dispatch({ type: "set-rowsperpage", payload: rows });
  }

  function handleChangeOrderBy(colDef: IColDef) {
    let desc = false;

    if (state.orderBy === colDef) {
      desc = !state.desc;
    }

    dispatch({ type: "set-orderBy", payload: { orderBy: colDef, desc } });
  }

  function handleChangeFilter(colDef: IColDef, value: any) {
    dispatch({ type: "set-filter", payload: { [colDef.prop]: value } });
  } // ------------ // Render

  if (error) {
    return renderError();
  }

  return (
    <Paper style={{ position: "relative", overflowX: "auto", width: "100%" }}>
      {loading && (
        <ProgressWrapper>
          <CircularProgress />
        </ProgressWrapper>
      )}

      <TablePlain
        {...tableMuiTheme}
        data={data}
        colDef={props.colDef}
        orderedBy={state.orderBy}
        desc={state.desc}
        onChangeOrderBy={handleChangeOrderBy}
        onChangeFilter={handleChangeFilter}
        onRowClick={props.onRowClick}
        subComponent={props.subComponent}
      />

      {props.disablePaging !== true && (
        <TablePagination
          component={ps => <div {...ps}>{ps.children}</div>}
          colSpan={props.colDef != null ? props.colDef.length : 1}
          count={state.total}
          rowsPerPage={state.rowsPerPage}
          page={state.page}
          onChangePage={(e, p) => handleChangePage(p)}
          onChangeRowsPerPage={e =>
            handleChangeRowsPerPage(parseInt(e.target.value, 10))
          }
          labelRowsPerPage={"Einträge pro Seite:"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} von ${count}`
          }
        />
      )}
    </Paper>
  );
}

const ProgressWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
`;

const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

function createDefaultState(): IState {
  return {
    rowsPerPage: 10,
    page: 0,
    total: 0,
    orderBy: undefined,
    desc: false,
    filter: {},
    reloadDummy: false
  };
}
