import { ITableMuiProps } from "@dccs/react-table-mui/lib/Props";
import { IDataState, IUseDataStateProps } from ".";
import { IDataGridTexts } from "./IDataGridTexts";
import { IState } from "./IState";

// Take everything from the base TableMuiProps and modify it a little bit.
export type IDataGridProps<T> = Omit<ITableMuiProps<T>, "data"> & {
  texts?: IDataGridTexts;
  disablePaging?: boolean;
  renderLoading?: () => React.ReactElement;
  renderError?: (
    load: () => void,
    errorText?: string,
    reloadText?: string
  ) => React.ReactElement;
  renderPaging?: (props: IRenderPagingProps) => React.ReactElement;
}
export interface IDataGridWithExternalStateProps<T> extends IDataGridProps<T> {
  state?: IDataState<T>;
}

export interface IDataGridWithInternalStateProps<T>
  extends IDataGridProps<T>,
    IUseDataStateProps<T> {}

export interface IRenderPagingProps extends IState {
    
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
