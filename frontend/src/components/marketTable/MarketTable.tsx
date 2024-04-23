import { TablePagination } from '@mui/material';
import './MarketTable.css';

type MarketTableProps = {
  children: React.ReactNode;
  className?: string;
  page?: never;
  count?: never;
  onPageChange?: (page: number) => never;
};

type MarketTableWithPaginationProps = {
  children: React.ReactNode;
  className?: string;
  page: number;
  count: number;
  onPageChange: (page: number) => void;
};

/**
 * A ``table`` tag with preconfigured CSS styles. Other than styling the table itself,
 * this component also provides styling for ``td`` and ``th`` that are
 * elements passed as its children. Also supports pagination with one-based indices.
 */
function MarketTable(props: MarketTableProps | MarketTableWithPaginationProps): JSX.Element {
  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number,
  ) {
    event?.preventDefault();
    if (props.onPageChange) {
      props.onPageChange(page + 1);
    }
  }

  const Pagination =
    props.page !== undefined ? (
      <tfoot className="table-pagination">
        <tr>
          <TablePagination
            onPageChange={handleChangePage}
            rowsPerPage={10}
            page={props.page - 1}
            rowsPerPageOptions={[]}
            count={props.count}
            showFirstButton
            showLastButton
          />
        </tr>
      </tfoot>
    ) : (
      <></>
    );

  return (
    <table className={`market-table-wrapper ${props.className || ''}`}>
      {props.children}
      {Pagination}
    </table>
  );
}

export default MarketTable;
