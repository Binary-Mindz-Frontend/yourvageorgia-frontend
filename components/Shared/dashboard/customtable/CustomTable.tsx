//Types
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
}

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto bg-gray-900 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-900">
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
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 1 ? "bg-gray-900" : "bg-black"}`}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
