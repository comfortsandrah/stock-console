"use client"

import React from "react"
import {
    useTable,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTableFeatures, features } from "./data-table-features"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  emptyContent?: React.ReactNode
  isLoading?: boolean
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyContent,
  isLoading,
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    data,
    columns,
  })

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-8 px-3 py-1.5 font-semibold text-xs text-muted-foreground">
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={`skeleton-row-${i}`} className="border-b last:border-0 hover:bg-transparent">
                <TableCell className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-md bg-muted/60 animate-pulse shrink-0" />
                    <div className="space-y-1.5 min-w-0">
                      <div className="h-3 w-32 rounded bg-muted/60 animate-pulse" />
                      <div className="h-2.5 w-16 rounded bg-muted/40 animate-pulse" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="h-4 w-16 rounded-full bg-muted/50 animate-pulse" />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="h-3.5 w-12 rounded bg-muted/50 animate-pulse" />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="h-4 w-20 rounded-full bg-muted/50 animate-pulse" />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="h-3.5 w-14 rounded bg-muted/50 animate-pulse" />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="h-3.5 w-20 rounded bg-muted/50 animate-pulse" />
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <div className="size-7 ml-auto rounded bg-muted/40 animate-pulse" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/30 transition-colors border-b last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-2 align-middle">
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center p-4"
              >
                {emptyContent ?? (
                  <div className="text-xs text-muted-foreground">
                    No products found.
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
