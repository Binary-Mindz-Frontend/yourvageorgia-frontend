// Types
export type Column<T> =
  | {
      header: string;
      accessor: keyof T;
      cell?: (row: T) => React.ReactNode;
    }
  | {
      header: string;
      accessor?: never;
      cell: (row: T) => React.ReactNode;
    };

export interface ITableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean; 
}

const CustomTable = <T extends object>({ columns, data, loading = false }: ITableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto bg-[#1a1a1a] rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#1a1a1a]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-5 py-4 text-center border text-sm text-white font-semibold tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-gray-900 divide-y divide-gray-90000">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-white">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-white">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 1 ? "bg-[#1a1a1a]" : "bg-black"}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-5 py-4 whitespace-nowrap text-sm text-white"
                  >
                    {column.cell
                      ? column.cell(row)
                      : "accessor" in column && column.accessor
                      ? String(row[column.accessor] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
