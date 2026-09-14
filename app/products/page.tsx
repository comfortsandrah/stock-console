"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
    AlertCircle,
    AlertTriangle,
    ArrowUpDown,
    Boxes,
    CheckCircle2,
    Filter,
    Package,
    RefreshCw,
    RotateCcw,
    Search,
    X,
    XCircle
} from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import React, { Suspense, useMemo } from "react"

import { createColumns } from "@/components/products/data-table/columns"
import { DataTable } from "@/components/products/data-table/data-table"
import { ProductPagination } from "@/components/products/product-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    useFetchCategoryList,
    useFetchProducts
} from "@/lib/hooks/useFetchProducts"
import type { ProductListing } from "@/types/product"

const sortOptions = [
    { label: "Name (A – Z)", value: "title-asc" },
    { label: "Name (Z – A)", value: "title-desc" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
    { label: "Stock (Low to High)", value: "stock-asc" },
    { label: "Stock (High to Low)", value: "stock-desc" },
    { label: "Rating (High to Low)", value: "rating-desc" },
    { label: "Rating (Low to High)", value: "rating-asc" },
]

const limitOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
]

function ProductsContainer() {
    const queryClient = useQueryClient()

    // URL Query State using nuqs
    const [page, setPage] = useQueryState("page", parseAsInteger)
    const [limit, setLimit] = useQueryState("limit", parseAsInteger)
    const [search, setSearch] = useQueryState("search")
    const [category, setCategory] = useQueryState("category")
    const [sortBy, setSortBy] = useQueryState("sortBy")
    const [order, setOrder] = useQueryState("order")
    const [delay, setDelay] = useQueryState("delay", parseAsInteger)
    const [status] = useQueryState("status", parseAsInteger)

    const currentPage = page ?? 1
    const currentLimit = limit ?? 10
    const currentSearch = search ?? ""
    const currentCategory = category ?? "all"
    const currentSortBy = sortBy ?? "title"
    const currentOrder = (order === "desc" ? "desc" : "asc") as "asc" | "desc"
    const currentSortValue = `${currentSortBy}-${currentOrder}`

    // TanStack Query: Fetch category list
    const { data: categories = [], isLoading: isCategoriesLoading } = useFetchCategoryList()

    // TanStack Query: Fetch products from DummyJSON
    const {
        data: productsResponse,
        isLoading: isProductsLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useFetchProducts({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch.trim() ? currentSearch.trim() : undefined,
        category: currentCategory !== "all" ? currentCategory : undefined,
        sortBy: currentSortBy,
        order: currentOrder,
        delay: delay ?? undefined,
        status: status ?? undefined,
    })

    // Map fetched products to ProductListing format for the DataTable
    const productListings = useMemo<ProductListing[]>(() => {
        if (!productsResponse?.products) return []

        return productsResponse.products.map((item) => ({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            sku: item.sku,
            category: item.category,
            stock: item.stock,
            availabilityStatus: item.availabilityStatus,
            price: item.price,
            updatedAt:
                item.meta?.updatedAt ||
                item.meta?.createdAt ||
                new Date().toISOString(),
        }))
    }, [productsResponse?.products])

    // Total counts & metrics
    const totalItems = productsResponse?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalItems / currentLimit))
    const safePage = Math.min(currentPage, totalPages)
    const firstItem = totalItems === 0 ? 0 : (safePage - 1) * currentLimit + 1
    const lastItem = Math.min(safePage * currentLimit, totalItems)

    React.useEffect(() => {
        if (productsResponse && productsResponse.total > 0 && currentPage > totalPages) {
            setPage(1)
        }
    }, [productsResponse, currentPage, totalPages, setPage])

    const stats = useMemo(() => {
        const total = totalItems
        const inStock = productListings.filter((p) => p.availabilityStatus === "In Stock").length
        const lowStock = productListings.filter((p) => p.availabilityStatus === "Low Stock").length
        const outOfStock = productListings.filter((p) => p.availabilityStatus === "Out of Stock").length

        return { total, inStock, lowStock, outOfStock }
    }, [totalItems, productListings])

    // Handlers
    const handleColumnSort = (field: string) => {
        if (currentSortBy === field) {
            setOrder(currentOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(field)
            setOrder("asc")
        }
        setPage(1)
    }

    const handleSortChange = (value: string | null) => {
        if (!value) return
        const [field, dir] = value.split("-")
        setSortBy(field)
        setOrder(dir as "asc" | "desc")
        setPage(1)
    }

    const handleCategoryChange = (value: string | null) => {
        setCategory(value === "all" ? null : value)
        setPage(1)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearch(val ? val : null)
        setPage(1)
    }

    const handleClearSearch = () => {
        setSearch(null)
        setPage(1)
    }

    const handleResetAllFilters = () => {
        setSearch(null)
        setCategory(null)
        setSortBy(null)
        setOrder(null)
        setDelay(null)
        setPage(1)
    }

    const hasActiveFilters = Boolean(
        currentSearch || (currentCategory && currentCategory !== "all") || sortBy || order
    )

    // Table columns bound with sort state
    const columns = useMemo(() => {
        return createColumns({
            sortBy: currentSortBy,
            order: currentOrder,
            onSort: handleColumnSort,
        })
    }, [currentSortBy, currentOrder])

    return (
        <div className="space-y-3.5">
            {/* Page Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Product Inventory
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Monitor stock levels, track supplies, and manage clinic product catalog.
                    </p>
                </div>

                {/* Live Query Refetch Button */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground border-border/70"
                        title="Refresh live catalog from API"
                    >
                        <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
                        <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Card className="border-border/60 shadow-2xs">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground">Total SKUs</p>
                            <p className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                                {isProductsLoading ? "..." : stats.total}
                            </p>
                        </div>
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                            <Boxes className="size-4" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-2xs">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground">In Stock (Page)</p>
                            <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {isProductsLoading ? "..." : stats.inStock}
                            </p>
                        </div>
                        <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-4" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-2xs">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground">Low Stock (Page)</p>
                            <p className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-0.5">
                                {isProductsLoading ? "..." : stats.lowStock}
                            </p>
                        </div>
                        <div className="rounded-md bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="size-4" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-2xs">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground">Out of Stock (Page)</p>
                            <p className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400 mt-0.5">
                                {isProductsLoading ? "..." : stats.outOfStock}
                            </p>
                        </div>
                        <div className="rounded-md bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                            <XCircle className="size-4" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Control & Filter Toolbar */}
            <Card className="border-border/60 shadow-2xs">
                <CardContent className="p-2.5 sm:p-3">
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Input */}
                        <div className="w-full lg:max-w-xs">
                            <InputGroup className="bg-background h-8">
                                <InputGroupAddon align="inline-start">
                                    <Search className="size-3.5 text-muted-foreground" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    value={currentSearch}
                                    onChange={handleSearchChange}
                                    placeholder="Search products..."
                                    className="text-xs"
                                />
                                {currentSearch && (
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                            size="icon-xs"
                                        >
                                            <X className="size-3" />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                        </div>

                        {/* Filters & Sorting */}
                        <div className="flex items-center gap-2">
                            {/* Category Filter */}
                            <div className="flex items-center gap-1.5">
                                <Select
                                    value={currentCategory}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="h-8 min-w-[155px] bg-background text-xs font-medium">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Filter className="size-3 text-muted-foreground shrink-0" />
                                            <span className="text-muted-foreground font-normal text-[11px]">Category:</span>
                                            <SelectValue placeholder="All Categories" />
                                        </div>
                                    </SelectTrigger>

                                    <SelectContent align="end" className="min-w-[190px] max-h-[300px]">
                                        <SelectItem value="all">
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <span>All Categories</span>
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                                    {totalItems}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort Selector */}
                            <div className="flex items-center gap-1.5">
                                <Select
                                    value={currentSortValue}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="h-8 min-w-[165px] bg-background text-xs font-medium">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <ArrowUpDown className="size-3 text-muted-foreground shrink-0" />
                                            <span className="text-muted-foreground font-normal text-[11px]">Sort:</span>
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>

                                    <SelectContent align="end" className="min-w-[190px]">
                                        {sortOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Filters Button */}
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetAllFilters}
                                    className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground border-dashed"
                                >
                                    <RotateCcw className="size-3" />
                                    <span>Reset</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active Filter Badges */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 mt-2 border-t border-border/50 text-xs text-muted-foreground">
                            <span className="font-medium text-[11px]">Active filters:</span>

                            {currentSearch && (
                                <Badge variant="secondary" className="gap-1 pr-1 text-[11px] h-5">
                                    <span>Query: &ldquo;{currentSearch}&rdquo;</span>
                                    <button
                                        onClick={handleClearSearch}
                                        className="rounded-full hover:bg-muted p-0.5"
                                        aria-label="Remove search filter"
                                    >
                                        <X className="size-2.5" />
                                    </button>
                                </Badge>
                            )}

                            {currentCategory !== "all" && (
                                <Badge variant="secondary" className="gap-1 pr-1 capitalize text-[11px] h-5">
                                    <span>Category: {currentCategory.replace(/-/g, " ")}</span>
                                    <button
                                        onClick={() => handleCategoryChange("all")}
                                        className="rounded-full hover:bg-muted p-0.5"
                                        aria-label="Remove category filter"
                                    >
                                        <X className="size-2.5" />
                                    </button>
                                </Badge>
                            )}

                            {(sortBy || order) && (
                                <Badge variant="secondary" className="gap-1 pr-1 text-[11px] h-5">
                                    <span>
                                        Sorted: {sortOptions.find((s) => s.value === currentSortValue)?.label || currentSortBy}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSortBy(null)
                                            setOrder(null)
                                        }}
                                        className="rounded-full hover:bg-muted p-0.5"
                                        aria-label="Reset sorting"
                                    >
                                        <X className="size-2.5" />
                                    </button>
                                </Badge>
                            )}

                            {delay && (
                                <Badge variant="secondary" className="gap-1 pr-1 text-[11px] h-5 border-amber-500/30 text-amber-600 bg-amber-500/10">
                                    <span>Delay: {delay}ms (Slow connection test)</span>
                                    <button
                                        onClick={() => setDelay(null)}
                                        className="rounded-full hover:bg-muted p-0.5"
                                        aria-label="Remove simulated delay"
                                    >
                                        <X className="size-2.5" />
                                    </button>
                                </Badge>
                            )}

                            <span className="ml-auto text-muted-foreground text-[11px]">
                                {totalItems} product{totalItems === 1 ? "" : "s"} found
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Error Banner if API Fails */}
            {isError && (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="p-3 flex items-center justify-between text-xs text-destructive">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="size-4 shrink-0" />
                            <span className="font-medium">
                                {error instanceof Error ? error.message : "Failed to load products from server."}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-7 gap-1 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive font-medium"
                        >
                            <RefreshCw className="size-3" />
                            <span>Retry Request</span>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Products Table with Skeletons and Full Error / Empty States */}
            <DataTable
                columns={columns}
                data={productListings}
                isLoading={isProductsLoading}
                emptyContent={
                    isError ? (
                        <Empty className="py-8 border-0">
                            <EmptyMedia variant="icon">
                                <AlertCircle className="size-6 text-destructive" />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle className="text-sm text-destructive font-semibold">
                                    Failed to load products
                                </EmptyTitle>
                                <EmptyDescription className="text-xs max-w-sm text-muted-foreground">
                                    {error instanceof Error ? error.message : "An error occurred while fetching product data. Please check your connection or retry."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    className="gap-1.5 text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10"
                                >
                                    <RefreshCw className="size-3" />
                                    <span>Retry</span>
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <Empty className="py-8 border-0">
                            <EmptyMedia variant="icon">
                                <Package className="size-5 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle className="text-sm">No matching products</EmptyTitle>
                                <EmptyDescription className="text-xs">
                                    We couldn&apos;t find any products matching your criteria.
                                </EmptyDescription>
                            </EmptyHeader>
                            {(hasActiveFilters || currentPage > 1) && (
                                <EmptyContent className="flex items-center justify-center gap-2">
                                    {currentPage > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(1)}
                                            className="gap-1 text-xs h-7"
                                        >
                                            <span>Go to Page 1</span>
                                        </Button>
                                    )}
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleResetAllFilters}
                                            className="gap-1 text-xs h-7"
                                        >
                                            <RotateCcw className="size-3" />
                                            <span>Clear filters</span>
                                        </Button>
                                    )}
                                </EmptyContent>
                            )}
                        </Empty>
                    )
                }
            />

            {/* Pagination Footer */}
            <div className="flex flex-col gap-2.5 rounded-lg border border-border/60 bg-card px-3 py-2 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <p className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                            Rows:
                        </p>

                        <Select
                            value={String(currentLimit)}
                            onValueChange={(val) => {
                                if (val) {
                                    setLimit(Number(val))
                                    setPage(1)
                                }
                            }}
                        >
                            <SelectTrigger className="h-7 w-[64px] bg-background text-xs px-2">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent align="start">
                                {limitOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-3.5 w-px bg-border/60 hidden sm:block" />

                    <p className="text-[11px] text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{firstItem}</span> to{" "}
                        <span className="font-medium text-foreground">{lastItem}</span> of{" "}
                        <span className="font-medium text-foreground">{totalItems}</span> items
                    </p>
                </div>

                <ProductPagination
                    page={safePage}
                    limit={currentLimit}
                    total={totalItems}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
    )
}

export default function Products() {
    return (
        <Suspense fallback={null}>
            <ProductsContainer />
        </Suspense>
    )
}
