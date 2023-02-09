export interface IDataGridTexts {
  errorText?: string;
  loadingText?: string;
  pagingText?: string;
  reloadText?: string;
  backIconButtonText?: string;
  nextIconButtonText?: string;
  labelRowsPerPage?: string;
  labelDisplayedRows?: ({
    count, from, to,
  }: {
    count?: number;
    from?: number;
    to?: number;
  }) => string;
}
