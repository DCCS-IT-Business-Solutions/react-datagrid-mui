import {
  TableMui,
} from "@dccs/react-table-mui";
import TablePagination from '@mui/material/TablePagination';
import { useDataState } from "./useDataState";
import { IDataGridWithExternalStateProps, IDataGridWithInternalStateProps } from "./Props";
import { TableSortLabel } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { SnackbarContent } from "@mui/material";
import { Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";


export function DataGridMui<T>(
  props: IDataGridWithInternalStateProps<T> | IDataGridWithExternalStateProps<T>
) {
  const internalState = useDataState<T>(props as IDataGridWithInternalStateProps<T>);

  const {
    rowsPerPage,
    page,
    total,
    orderBy,
    sort,
    filter,
    data,
    loading,
    error,
    handleChangeOrderBy,
    handleChangeFilter,
    handleChangeRowsPerPage,
    handleChangePage,
    load,
  } = (props as IDataGridWithExternalStateProps<T>).state || internalState;

  function renderTable() {
    const ps = {
      data,
      colDef: props.colDef,
      orderBy,
      sort,
      filter,
      onChangeOrderBy: handleChangeOrderBy,
      onChangeFilter: handleChangeFilter,
      onRowClick: props.onRowClick,
      subComponent: props.subComponent,
      selectedRow: props.selectedRow,
      selectedRowProps: props.selectedRowProps,
      onChangeSelectedRow: props.onChangeSelectedRow,
      rowSelectionColumnName: props.rowSelectionColumnName,
      rowProps: props.rowProps,
      renderHeaderCell: props.renderHeaderCell,
      renderFooterCell: props.renderFooterCell,
      renderFilter: props.renderFilter,
      renderExpansionIndicator: props.renderExpansionIndicator,
      cellProps: props.cellProps,
      ellipsis: props.ellipsis,
    };

    return <TableMui
      {...ps}
      renderSortHint={() => <TableSortLabel active style={renderSortHint} />}
    />
  }

  function renderLoading() {
    if (props.renderLoading != null) {
      return props.renderLoading();
    }

    return <div style={styles.progressWrapper}>
      <CircularProgress />
    </div>
  }

  function renderError() {
    let errorText = "Die Daten konnten nicht geladen werden.";
    if (props.texts && props.texts.errorText != null) {
      errorText = props.texts.errorText;
    }

    let reloadText = "Neu laden";
    if (props.texts && props.texts.reloadText != null) {
      reloadText = props.texts.reloadText;
    }

    if (props.renderError != null) {
      return props.renderError(load, errorText, reloadText);
    }
    return (
      <SnackbarContent
        style={{ width: "100%", boxSizing: "border-box" }}
        message={
          <div style={styles.errorMessage}>
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

  function renderPaging() {
    const labelRowsPerPage = props.texts && props.texts.labelRowsPerPage;
    const backIconButtonText = props.texts && props.texts.backIconButtonText;
    const nextIconButtonText = props.texts && props.texts.nextIconButtonText;
    const labelDisplayedRows = props.texts && props.texts.labelDisplayedRows;

    // Custom rendering
    if (props.renderPaging != null) {

      return props.renderPaging({
        rowsPerPage,
        page,
        total,
        orderBy,
        sort,
        filter,
        labelRowsPerPage,
        backIconButtonText,
        nextIconButtonText,
        labelDisplayedRows,
        handleChangePage,
        handleChangeRowsPerPage,
      });
    }

    const defaultLabelDisplayedRows = ({ from, to, count }: any) =>
      `${from}-${to} von ${count}`;

    const handlePageChange = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => handleChangePage(newPage);

    const handleCRPP = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => handleChangeRowsPerPage(parseInt(e.target.value, 10));


    return (
      <TablePagination
        component={(ps: any) => <div {...ps}>{ps.children}</div>}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleCRPP}
        labelRowsPerPage={labelRowsPerPage || "Einträge pro Seite:"}
        labelDisplayedRows={labelDisplayedRows || defaultLabelDisplayedRows}
      />
    );
  }

  if (error) {
    return renderError();
  }

  return (
    <div style={{ position: "relative", overflowX: "auto", width: "100%" }}>
      {loading && renderLoading()}

      {renderTable()}

      {props.disablePaging !== true && renderPaging()}
    </div>
  );
}
const renderSortHint = {
  opacity: 0.2,
} as React.CSSProperties;

const styles = {
  progressWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.5)"
  } as React.CSSProperties,
  errorMessage: {
    display: "flex",
    alignItems: "center",
    svg: {
      marginRight: "0.5rem"
    }
  } as React.CSSProperties
}
