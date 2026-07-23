import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileX,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge, BadgeVariant } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Filter records...',
  pageSize: initialPageSize = 5,
  onRowClick,
  selectable = true,
  onSelectionChange,
  title,
  subtitle,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());

  // Search Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, searchQuery]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Row Selection logic
  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedIds.has(row.id ?? row));

  const toggleSelectAll = () => {
    const newSelected = new Set(selectedIds);
    if (isAllSelected) {
      paginatedData.forEach((row) => newSelected.delete(row.id ?? row));
    } else {
      paginatedData.forEach((row) => newSelected.add(row.id ?? row));
    }
    setSelectedIds(newSelected);

    const selectedRows = data.filter((row) => newSelected.has(row.id ?? row));
    onSelectionChange?.(selectedRows);
  };

  const toggleSelectRow = (row: T) => {
    const key = row.id ?? row;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedIds(newSelected);

    const selectedRows = data.filter((item) => newSelected.has(item.id ?? item));
    onSelectionChange?.(selectedRows);
  };

  return (
    <div
      className={cn(
        'w-full bg-zinc-950/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col',
        className
      )}
    >
      {/* Table Header Controls */}
      <div className="p-4 border-b border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {(title || subtitle) && (
          <div>
            {title && <h3 className="font-outfit font-bold text-base text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
          </div>
        )}

        <div className="flex items-center gap-3 flex-1 justify-end">
          <Input
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            isClearable
            onClear={() => setSearchQuery('')}
            inputSize="sm"
            className="max-w-xs"
          />

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900/60 border-b border-zinc-800/80 uppercase font-semibold text-[11px] text-zinc-400 tracking-wider">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 font-semibold select-none',
                    col.sortable && 'cursor-pointer hover:text-white hover:bg-zinc-800/40 transition-colors',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right'
                  )}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5',
                      col.align === 'center' && 'justify-center',
                      col.align === 'right' && 'justify-end'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-zinc-500">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-zinc-500 space-y-2"
                >
                  <FileX className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs">No records found matching current criteria.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowKey = row.id ?? idx;
                const isSelected = selectedIds.has(rowKey);

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'hover:bg-zinc-900/60 transition-colors cursor-pointer group',
                      isSelected && 'bg-indigo-500/10'
                    )}
                  >
                    {selectable && (
                      <td
                        className="px-4 py-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectRow(row);
                        }}
                      >
                        <button type="button" className="text-zinc-400 hover:text-white">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3.5 font-medium whitespace-nowrap',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-zinc-200">
            {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-zinc-200">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-zinc-200">{sortedData.length}</span> entries
          {selectedIds.size > 0 && (
            <span className="ml-2 text-indigo-400 font-semibold">
              ({selectedIds.size} selected)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-semibold px-2 text-zinc-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
