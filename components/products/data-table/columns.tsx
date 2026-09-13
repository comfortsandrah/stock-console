"use client"

import { createColumnHelper } from "@tanstack/react-table"
import {
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    Copy,
    Check,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductListing } from "@/types/product"
import { DataTableFeatures } from "./data-table-features"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"

const columnHelper = createColumnHelper<DataTableFeatures, ProductListing>()

interface ColumnOptions {
    sortBy?: string | null
    order?: "asc" | "desc" | null
    onSort?: (field: string) => void
}

function SortableHeader({
    title,
    field,
    sortBy,
    order,
    onSort,
}: {
    title: string
    field: string
    sortBy?: string | null
    order?: "asc" | "desc" | null
    onSort?: (field: string) => void
}) {
    const isSorted = sortBy === field

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 px-2 font-semibold text-xs text-foreground hover:bg-muted/80 hover:text-foreground group/sort"
            onClick={() => onSort?.(field)}
        >
            <span>{title}</span>
            {isSorted ? (
                order === "asc" ? (
                    <ArrowUp className="ml-1 size-3 text-foreground" />
                ) : (
                    <ArrowDown className="ml-1 size-3 text-foreground" />
                )
            ) : (
                <ArrowUpDown className="ml-1 size-3 text-muted-foreground/50 group-hover/sort:text-muted-foreground transition-colors" />
            )}
        </Button>
    )
}

export function createColumns(options: ColumnOptions = {}) {
    const { sortBy, order, onSort } = options

    return columnHelper.columns([
        // Product
        columnHelper.accessor("title", {
            header: () => (
                <SortableHeader
                    title="Product"
                    field="title"
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const product = row.original

                return (
                    <div className="flex items-center gap-2.5">
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-md border bg-muted/40">
                            <Image
                                src={product.thumbnail}
                                alt={product.title}
                                className="size-full object-cover"
                                width={64}
                                height={64}
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement
                                    target.src = "https://placehold.co/64x64?text=Item"
                                }}
                            />
                        </div>

                        <div className="min-w-0 max-w-[260px]">
                            <Link
                                href={`/products/${product.id}`}
                                className="block truncate font-medium text-foreground hover:text-primary transition-colors hover:underline text-xs"
                                title={product.title}
                            >
                                {product.title}
                            </Link>

                            <span className="block font-mono text-[10px] text-muted-foreground leading-none mt-0.5">
                                {product.sku}
                            </span>
                        </div>
                    </div>
                )
            },
        }),

        // Category
        columnHelper.accessor("category", {
            header: () => (
                <SortableHeader
                    title="Category"
                    field="category"
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                return (
                    <Badge
                        variant="secondary"
                        className="capitalize font-normal text-[11px] px-1.5 py-0 h-5 bg-muted/60 text-muted-foreground border border-border/50"
                    >
                        {row.original.category}
                    </Badge>
                )
            },
        }),

        // Stock
        columnHelper.accessor("stock", {
            header: () => (
                <SortableHeader
                    title="Stock"
                    field="stock"
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const stock = row.original.stock

                return (
                    <div className="flex items-center gap-1 font-mono text-xs font-medium">
                        <span className={stock === 0 ? "text-destructive font-semibold" : "text-foreground"}>
                            {stock.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-sans font-normal">units</span>
                    </div>
                )
            },
        }),

        // Status
        columnHelper.accessor("availabilityStatus", {
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.availabilityStatus

                let badgeStyles = "bg-muted text-muted-foreground border-transparent"
                let dotStyles = "bg-muted-foreground"

                if (status === "In Stock") {
                    badgeStyles = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    dotStyles = "bg-emerald-500"
                } else if (status === "Low Stock") {
                    badgeStyles = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                    dotStyles = "bg-amber-500"
                } else if (status === "Out of Stock") {
                    badgeStyles = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                    dotStyles = "bg-rose-500"
                }

                return (
                    <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 font-medium text-[11px] px-1.5 py-0 h-5 rounded-full border ${badgeStyles}`}
                    >
                        <span className={`size-1 rounded-full shrink-0 ${dotStyles}`} />
                        {status}
                    </Badge>
                )
            },
        }),

        // Price
        columnHelper.accessor("price", {
            header: () => (
                <SortableHeader
                    title="Price"
                    field="price"
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const price = row.original.price

                return (
                    <span className="font-mono font-medium text-foreground text-xs">
                        ${price.toFixed(2)}
                    </span>
                )
            },
        }),

        // Updated
        columnHelper.accessor("updatedAt", {
            header: () => (
                <SortableHeader
                    title="Updated"
                    field="updatedAt"
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => {
                const date = new Date(row.original.updatedAt)

                return (
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                )
            },
        }),

        // Actions
        columnHelper.display({
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const product = row.original

                const handleCopySku = (e: React.MouseEvent) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(product.sku)
                    toast.add({
                        title: "SKU Copied",
                        description: `Copied ${product.sku} to clipboard`,
                        type: "success",
                    })
                }

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        className="size-7 text-muted-foreground hover:text-foreground"
                                        aria-label={`Actions for ${product.title}`}
                                    >
                                        <MoreHorizontal className="size-3.5" />
                                    </Button>
                                }
                            />

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem render={<Link href={`/products/${product.id}`} className="flex items-center gap-2 w-full cursor-pointer" />}>
                                    <Eye className="size-3.5 text-muted-foreground" />
                                    <span>View details</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleCopySku} className="cursor-pointer">
                                    <Copy className="size-3.5 text-muted-foreground" />
                                    <span>Copy SKU</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        }),
    ])
}


export const columns = createColumns()