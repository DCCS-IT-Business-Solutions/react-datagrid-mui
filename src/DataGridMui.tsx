import * as React from "react";
import { TablePlain, ITablePlainProps } from "@dccs/react-table-plain";
import { tableMuiTheme } from "@dccs/react-table-mui";
// import { IRenderPagingProps } from "@dccs/react-datagrid-plain";
import {
  CircularProgress,
  TablePagination,
  SnackbarContent,
  Button
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

const progressWrapper = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.5)"
} as React.CSSProperties;

const errorMessage = {
  display: "flex",
  alignItems: "center",
  svg: {
    marginRight: "0.5rem"
  }
} as React.CSSProperties;

function renderError(load: any, errorText?: string, reloadText?: string) {
  debugger;
  return (
    <SnackbarContent
      style={{ width: "100%", boxSizing: "border-box" }}
      message={
        <div style={errorMessage}>
          <ErrorIcon /> {errorText || "Die Daten konnten nicht geladen werden."}
        </div>
      }
      action={
        <Button onClick={() => load()} color="primary" size="small">
          {reloadText || "Neu laden"}
        </Button>
      }
    />
  );
}

export const datagridMuiTheme = {
  renderTable: (ps: ITablePlainProps) => (
    <TablePlain {...tableMuiTheme} {...ps} />
  ),
  renderLoading: () => (
    <div style={progressWrapper}>
      <CircularProgress />
    </div>
  ),
  renderError,
  renderPaging: ({
    total,
    rowsPerPage,
    page,
    labelRowsPerPage,
    backIconButtonText,
    nextIconButtonText,
    labelDisplayedRows,
    handleChangePage,
    handleChangeRowsPerPage
  }: any) => {
    const defaultLabelDisplayedRows = ({ from, to, count }: any) =>
      `${from}-${to} von ${count}`;

    return (
      <TablePagination
        component={ps => <div {...ps}>{ps.children}</div>}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(e, p) => handleChangePage(p)}
        onChangeRowsPerPage={e =>
          handleChangeRowsPerPage(parseInt(e.target.value, 10))
        }
        labelRowsPerPage={labelRowsPerPage || "Einträge pro Seite:"}
        labelDisplayedRows={labelDisplayedRows || defaultLabelDisplayedRows}
        backIconButtonText={backIconButtonText || "Previous  page"}
        nextIconButtonText={nextIconButtonText || "Next  page"}
      />
    );
  }
};
