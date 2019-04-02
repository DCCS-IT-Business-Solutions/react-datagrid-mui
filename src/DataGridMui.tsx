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

interface IProps {
  colDef: IColDef[];
  initRowsPerPage?: number;
  onLoadData: (
    page: number,
    rowsPerPage: number,
    orderBy: string,
    desc: boolean,
    filter: { [key: string]: any }
  ) => Promise<{ total: number; data: any[] }>;
  disablePaging?: boolean;
  onRowClick?: (data: any) => void;
  subComponent?: (data: any) => React.ReactNode;
}

interface IState {
  rowsPerPage: number;
  page: number;
  total: number;
  data: any[];
  loading: boolean;
  error: boolean;
  orderBy?: IColDef;
  desc: boolean;
  filter: any;
}

export class DataGridMui extends React.Component<IProps, IState> {
  state = {
    rowsPerPage: 10,
    page: 0,
    total: 0,
    data: [],
    loading: false,
    error: false,
    orderBy: undefined,
    desc: false,
    filter: {}
  };

  componentDidMount() {
    if (this.props.initRowsPerPage) {
      this.setState({ rowsPerPage: this.props.initRowsPerPage }, this.load);
    } else {
      this.load();
    }
  }

  render() {
    if (this.state.error) {
      return this.renderError();
    }

    return (
      <Paper style={{ position: "relative", overflowX: "auto", width: "100%" }}>
        {this.state.loading && (
          <ProgressWrapper>
            <CircularProgress />
          </ProgressWrapper>
        )}

        <TablePlain
          {...tableMuiTheme}
          data={this.state.data}
          colDef={this.props.colDef}
          orderedBy={this.state.orderBy}
          desc={this.state.desc}
          onChangeOrderBy={this.handleChangeOrderBy}
          onChangeFilter={this.handleChangeFilter}
          onRowClick={this.props.onRowClick}
          subComponent={this.props.subComponent}
        />

        {this.props.disablePaging !== true && (
          <TablePagination
            component={props => <div {...props}>{props.children}</div>}
            colSpan={this.props.colDef != null ? this.props.colDef.length : 1}
            count={this.state.total}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={(e, p) => this.handleChangePage(p)}
            onChangeRowsPerPage={e =>
              this.handleChangeRowsPerPage(parseInt(e.target.value, 10))
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

  renderError() {
    return (
      <SnackbarContent
        style={{ width: "100%" }}
        message={
          <ErrorMessage>
            <ErrorIcon />
            Die Daten konnten nicht geladen werden.
          </ErrorMessage>
        }
        action={
          <Button onClick={() => this.load()} color="primary" size="small">
            Neu laden
          </Button>
        }
      />
    );
  }

  load() {
    this.setState({ loading: true, error: false });
    this.props
      .onLoadData(
        this.state.page + 1,
        this.state.rowsPerPage,
        this.state.orderBy ? (this.state.orderBy! as IColDef).prop : "",
        this.state.desc,
        this.state.filter
      )
      .then(({ data, total }) =>
        this.setState({
          data,
          total,
          loading: false
        })
      )
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  handleChangePage = (page: number) => {
    this.setState({ page }, this.load);
  };

  handleChangeRowsPerPage = (rows: number) => {
    this.setState({ rowsPerPage: rows }, this.load);
  };

  handleChangeOrderBy = (colDef: IColDef) => {
    let desc = false;
    if (this.state.orderBy === colDef) {
      desc = !this.state.desc;
    }
    this.setState({ orderBy: colDef, desc }, this.load);
  };

  handleChangeFilter = (colDef: IColDef, value: any) => {
    this.setState(
      p => ({
        filter: {
          ...p.filter,
          [colDef.prop]: value
        }
      }),
      this.load
    );
  };
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
