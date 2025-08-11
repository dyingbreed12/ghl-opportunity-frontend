import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

// Helper to format currency
// const formatCurrency = (num) =>
//   typeof num === 'number' ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' }) : '-';

function OpportunitiesTable({ data }) {
  const columns = useMemo(
    () => [
      { Header: 'Property Address', accessor: 'PropertyAddress' },
      { Header: 'Property Type', accessor: 'PropertyType' },
      { Header: 'Deal Type', accessor: 'DealType' },
      {
        Header: 'Asking Price',
        accessor: 'AskingPrice',
        //Cell: ({ value }) => formatCurrency(value),
        Cell: ({ value }) => value,
      },
      {
        Header: 'Assignment Fee',
        accessor: 'AssignmentFee',
        //Cell: ({ value }) => formatCurrency(value),
        Cell: ({ value }) => value,
      },
      {
        Header: 'Contracted Price',
        accessor: 'ContractedPrice',
        //Cell: ({ value }) => formatCurrency(value),
        Cell: ({ value }) => value,
      },
      { Header: 'Compensation Type', accessor: 'CompensationType' },
     {
        Header: 'JV Share',
        accessor: 'JVShare',
        Cell: ({ value }) => (value !== null && value !== undefined && value !== '' ? `${value}%` : ''),
      },
      {
        Header: 'Option Period Expiration',
        accessor: 'OptionPeriodExpiration',
        Cell: ({ value }) => (value ? new Date(value).toISOString().substring(0, 10) : ''),
      },
      {
        Header: 'Closing Date',
        accessor: 'ClosingDate',
        Cell: ({ value }) => (value ? new Date(value).toISOString().substring(0, 10) : ''),
      },
      { Header: 'Access', accessor: 'Access' },
      { Header: 'Lockbox Code', accessor: 'LockboxCode' },
      { Header: 'Showing Time', accessor: 'ShowingTime' },
      { Header: 'Quality', accessor: 'Quality' },
      {
        Header: 'Marketing Link',
        accessor: 'MarketingLink',
        Cell: ({ value }) =>
          value ? (
            <a href={value} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
              Click Here
            </a>
          ) : (
            ''
          ),
      },
      {
        Header: 'Pictures Link',
        accessor: 'PicturesLink',
        Cell: ({ value }) =>
          value ? (
            <a href={value} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
              Click Here
            </a>
          ) : (
            ''
          ),
      },
      { Header: 'Wholesaler', accessor: 'Wholesaler' },
      { Header: 'Notes', accessor: 'Notes' },
    ],
    []
  );

  const [pageSize, setPageSize] = useState(10);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setPageSizeRT,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: useMemo(() => data ?? [], [data]),
      initialState: { pageIndex: 0, pageSize },
      getRowId: (row, relativeIndex) => (row.Id != null ? row.Id.toString() : `row_${relativeIndex}`),
    },
    useSortBy,
    usePagination
  );

  const onPageSizeChange = (e) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setPageSizeRT(size);
  };

  return (
    <>
      <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key: key2, ...restColumnProps } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={key2}
                      {...restColumnProps}
                      style={{
                        borderBottom: '2px solid black',
                        padding: '8px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        userSelect: 'none',
                        backgroundColor: '#f0f0f0',
                      }}
                      title="Click to sort"
                    >
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                No opportunities found.
              </td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <tr key={key} {...restRowProps}>
                  {row.cells.map(cell => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                    return (
                      <td
                        key={cellKey}
                        {...restCellProps}
                        title={
                          typeof cell.value === 'string' ? cell.value : JSON.stringify(cell.value)
                        }
                        style={{
                          padding: '8px',
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'default',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
      >
        <div>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>

        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={{ marginRight: 5 }}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} style={{ marginRight: 5 }}>
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} style={{ marginRight: 5 }}>
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>

        <div>
          <label>
            Rows per page:{' '}
            <select value={pageSize} onChange={onPageSizeChange}>
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}

export default OpportunitiesTable;
