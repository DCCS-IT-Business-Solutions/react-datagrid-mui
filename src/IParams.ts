import { SortDirection } from "@dccs/react-table-mui";
import { PropType } from "@dccs/react-table-mui/lib/IColDef";

export interface IParams<T extends object, F extends object> {
  rowsPerPage: number;
  page: number;
  total: number;
  orderBy?: PropType<T>;
  sort?: SortDirection;
  filter: F | undefined;
}
