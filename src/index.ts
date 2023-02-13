import { SortDirection } from "@dccs/react-table-mui";
import { PropType } from "@dccs/react-table-mui/lib/IColDef";

export type OnLoadData<T extends object, F extends object> = (
  page: number,
  rowsPerPage: number,
  orderBy: PropType<T> | undefined,
  sort: SortDirection | undefined,
  filter: F | undefined
) => Promise<{ total: number; data: T[] }>;

export * from "./DataGridMui";
export * from "./useDataState";
export { createSource, createJsonServerSource } from "./utils/source";
