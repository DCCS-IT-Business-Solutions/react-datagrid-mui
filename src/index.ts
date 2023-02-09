import { SortDirection } from "@dccs/react-table-mui";

export type OnLoadData = (
  page: number,
  rowsPerPage: number,
  orderBy: string | undefined,
  sort: SortDirection | undefined,
  filter: { [key: string]: any } | undefined
) => Promise<{ total: number; data: any[] }>;

export * from "./DataGridMui";
export * from "./useDataState";
export { createSource, createJsonServerSource } from "./utils/source";
