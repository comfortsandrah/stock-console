"use client"

import { useMemo } from "react"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ProductPaginationProps {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
}

export function ProductPagination({
    page,
    limit,
    total,
    onPageChange,
}: ProductPaginationProps) {
    const totalPages = Math.ceil(total / limit)

    const pages = useMemo(() => {
        const visiblePages: (number | "ellipsis")[] = []

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1)
        }

        visiblePages.push(1)

        if (page > 4) {
            visiblePages.push("ellipsis")
        }

        const start = Math.max(2, page - 1)
        const end = Math.min(totalPages - 1, page + 1)

        for (let i = start; i <= end; i++) {
            visiblePages.push(i)
        }

        if (page < totalPages - 3) {
            visiblePages.push("ellipsis")
        }

        visiblePages.push(totalPages)

        return visiblePages
    }, [page, totalPages])

    return (
        <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(event) => {
                            event.preventDefault()

                            if (page > 1) {
                                onPageChange(page - 1)
                            }
                        }}
                        size="sm"
                        className={
                            page === 1
                                ? "h-7 text-xs px-2 pointer-events-none opacity-50"
                                : "h-7 text-xs px-2"
                        }
                    />
                </PaginationItem>

                {/* Pages */}
                {pages.map((item, index) => {
                    if (item === "ellipsis") {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis className="size-7" />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={item}>
                            <PaginationLink
                                href="#"
                                isActive={item === page}
                                size="sm"
                                className="size-7 p-0 text-xs font-medium"
                                onClick={(event) => {
                                    event.preventDefault()
                                    onPageChange(item)
                                }}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(event) => {
                            event.preventDefault()

                            if (page < totalPages) {
                                onPageChange(page + 1)
                            }
                        }}
                        size="sm"
                        className={
                            page === totalPages
                                ? "h-7 text-xs px-2 pointer-events-none opacity-50"
                                : "h-7 text-xs px-2"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}