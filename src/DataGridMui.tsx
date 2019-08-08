import * as React from "react";
import styled from "styled-components";
import { TablePlain, IProps as ITableProps } from "@dccs/react-table-plain";
import { tableMuiTheme } from "@dccs/react-table-mui";
import { IRenderPagingProps } from "@dccs/react-datagrid-plain";
import CircularProgress from "@material-ui/core/CircularProgress";
import TablePagination from "@material-ui/core/TablePagination";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Button from "@material-ui/core/Button/Button";
import ErrorIcon from "@material-ui/icons/Error";

function renderError(load: any) {
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

export const datagridMuiTheme = {
  renderTable: (ps: ITableProps) => <TablePlain {...tableMuiTheme} {...ps} />,
  renderLoading: () => (
    <ProgressWrapper>
      <CircularProgress />
    </ProgressWrapper>
  ),
  renderError,
  renderPaging: ({
    total,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage
  }: IRenderPagingProps) => (
    <TablePagination
      component={ps => <div {...ps}>{ps.children}</div>}
      count={total}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={(e, p) => handleChangePage(p)}
      onChangeRowsPerPage={e =>
        handleChangeRowsPerPage(parseInt(e.target.value, 10))
      }
      labelRowsPerPage={"Einträge pro Seite:"}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
    />
  )
};

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
