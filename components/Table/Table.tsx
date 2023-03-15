import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import React from 'react';

export type RowData<T> = {
} & T;

interface TableProps<T> {
  title?: string;
  caption: string;  
  data: RowData<T>[] | undefined;
  columns: ColumnDef<T, any>[];
}

const Table = <T extends unknown>(props: TableProps<T>) => {
  const { title, caption, columns, data = [] } = props;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="relative overflow-x-auto shadow-sm border sm:rounded-md">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          {title && title}
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            {caption && caption}
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="px-6 py-3">
                {headerGroup.headers.map(header => (
                    <th key={header.id}  className="px-6 py-3">
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </th>
                ))}
                </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}
        </tbody>

      </table>
    </div>
  );
};

Table.defaultProps = {

};

Table.propTypes = {

};

export default Table;
