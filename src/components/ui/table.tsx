import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react"
import { cn } from "../../lib/utils"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  actions?: (row: T) => React.ReactNode
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search inventory...",
  searchKeys = [],
  actions,
  selectable = false,
  onSelectionChange,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Handle Search
  const filteredData = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data

    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key]
        if (val === undefined || val === null) return false
        return String(val).toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, searchKeys])

  // Handle Sorting logic
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key]
        const bVal = (b as any)[sortConfig.key]

        if (aVal === undefined || bVal === undefined) return 0

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (aStr < bStr) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aStr > bStr) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredData, sortConfig])

  // Row Selection Helpers
  const toggleRow = (id: string | number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)

    if (onSelectionChange) {
      const selectedRows = data.filter((row) => newSelected.has(row.id))
      onSelectionChange(selectedRows)
    }
  }

  const toggleAll = () => {
    const newSelected = new Set<string | number>()
    if (selectedIds.size < sortedData.length) {
      sortedData.forEach((row) => newSelected.add(row.id))
    }
    setSelectedIds(newSelected)

    if (onSelectionChange) {
      const selectedRows = data.filter((row) => newSelected.has(row.id))
      onSelectionChange(selectedRows)
    }
  }

  const isAllSelected = sortedData.length > 0 && selectedIds.size === sortedData.length

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4.5 w-4.5 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-950/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
        />
      </div>

      {/* Table container */}
      <div className="overflow-x-auto rounded-xl border border-white/10 glass-card">
        <table className="w-full border-collapse text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950/80 text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/10">
            <tr>
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-4 font-semibold select-none",
                    col.sortable && "cursor-pointer hover:text-white transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-zinc-500">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-white/5 animate-pulse">
                    {selectable && <td className="px-6 py-4.5"><div className="h-4 w-4 bg-zinc-800 rounded" /></td>}
                    {columns.map((col) => (
                      <td key={`skeleton-${i}-${col.key}`} className="px-6 py-4.5">
                        <div className="h-4 bg-zinc-800 rounded w-24" />
                      </td>
                    ))}
                    {actions && <td className="px-6 py-4.5 text-right"><div className="h-8 w-16 bg-zinc-800 rounded ml-auto" /></td>}
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-6 py-12 text-center text-zinc-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                sortedData.map((row, idx) => {
                  const isSelected = selectedIds.has(row.id)
                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className={cn(
                        "border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group",
                        isSelected && "bg-indigo-500/[0.03] hover:bg-indigo-500/[0.05]"
                      )}
                    >
                      {selectable && (
                        <td className="px-6 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row.id)}
                            className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={`${row.id}-${col.key}`} className="px-6 py-3.5 font-medium text-zinc-100">
                          {col.render ? col.render(row) : (row as any)[col.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-3.5 text-right opacity-80 group-hover:opacity-100 transition-opacity">
                          {actions(row)}
                        </td>
                      )}
                    </motion.tr>
                  )
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
