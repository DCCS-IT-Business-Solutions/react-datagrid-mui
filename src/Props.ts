import { ITableMuiProps } from "@dccs/react-table-mui/lib/Props";
import { IDataState, IUseDataStateProps } from ".";
import { IDataGridTexts } from "./IDataGridTexts";
import { IParams } from "./IParams";

// Take everything from the base TableMuiProps and modify it a little bit.
export type IDataGridProps<T extends object, F extends keyof T & object> = Omit<ITableMuiProps<T, F>, "data"> & {
  texts?: IDataGridTexts;
  disablePaging?: boolean;
  renderLoading?: () => React.ReactElement;
  renderError?: (
    load: () => void,
    errorText?: string,
    reloadText?: string
  ) => React.ReactElement;
  renderPaging?: (props: IRenderPagingProps<T, F>) => React.ReactElement;
}
export interface IDataGridWithExternalStateProps<T extends object, F extends keyof T & object> extends IDataGridProps<T, F> {
  state?: IDataState<T, F>;
}

export interface IDataGridWithInternalStateProps<T extends object, F extends keyof T & object>
  extends IDataGridProps<T, F>, IUseDataStateProps<T, F> {}

export interface IRenderPagingProps<T extends object, F extends keyof T & object> extends IParams<T, F> {

  backIconButtonText?: string;
  nextIconButtonText?: string;
  labelRowsPerPage?: string;
  // Example labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
  labelDisplayedRows?: ({
    count,
    from,
    to,
  }: {
    count?: number;
    from?: number;
    to?: number;
  }) => string;
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (rows: number) => void;
}
