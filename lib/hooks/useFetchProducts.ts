"use client"

import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
    type UseQueryOptions,
    type UseMutationOptions,
} from "@tanstack/react-query"
import type { Product, ProductsResponse } from "@/types/product"

export const DUMMY_JSON_BASE_URL = "https://dummyjson.com"

export interface FetchProductsParams {
    limit?: number
    skip?: number
    page?: number
    search?: string | null
    category?: string | null
    sortBy?: string | null
    order?: "asc" | "desc" | string | null
    select?: string | string[]
    delay?: number | string | null
    status?: number | string | null
}

/**
 * Query Keys factory for predictable caching and invalidation
 */
export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params: FetchProductsParams) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: number | string) => [...productKeys.details(), id] as const,
    categories: () => [...productKeys.all, "categories"] as const,
    categoryList: () => [...productKeys.all, "category-list"] as const,
}

// Stock overrides store for simulated backend persistence
export interface StockOverride {
    stock: number
    availabilityStatus: string
    updatedAt: string
}

export function getStockOverrides(): Record<string, StockOverride> {
    if (typeof window === "undefined") return {}
    try {
        const stored = localStorage.getItem("product_stock_overrides")
        return stored ? JSON.parse(stored) : {}
    } catch {
        return {}
    }
}

export function setStockOverride(id: number | string, stock: number, availabilityStatus?: string): StockOverride {
    const computedStatus =
        availabilityStatus ||
        (stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock")

    const override: StockOverride = {
        stock,
        availabilityStatus: computedStatus,
        updatedAt: new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
        try {
            const overrides = getStockOverrides()
            overrides[String(id)] = override
            localStorage.setItem("product_stock_overrides", JSON.stringify(overrides))
            window.dispatchEvent(
                new CustomEvent("stock_updated", {
                    detail: { id, stock, availabilityStatus: computedStatus },
                })
            )
        } catch (e) {
            console.error("Failed to save stock override to localStorage", e)
        }
    }

    return override
}

export function applyStockOverridesToProduct(product: Product): Product {
    if (!product) return product
    const overrides = getStockOverrides()
    const override = overrides[String(product.id)]
    if (!override) return product

    return {
        ...product,
        stock: override.stock,
        availabilityStatus: override.availabilityStatus,
        meta: {
            ...product.meta,
            updatedAt: override.updatedAt,
        },
    }
}

/**
 * Fetch products from DummyJSON supporting search, category filter, pagination, sorting and select fields
 */
export async function fetchProducts(
    params: FetchProductsParams = {},
    signal?: AbortSignal
): Promise<ProductsResponse> {
    const {
        limit = 10,
        skip,
        page,
        search,
        category,
        sortBy,
        order,
        select,
        delay,
        status,
    } = params

    const resolvedLimit = limit
    const resolvedSkip =
        skip !== undefined
            ? skip
            : page && page > 0
            ? (page - 1) * resolvedLimit
            : 0

    let endpoint = `${DUMMY_JSON_BASE_URL}/products`
    const queryParams = new URLSearchParams()

    queryParams.set("limit", String(resolvedLimit))
    queryParams.set("skip", String(resolvedSkip))

    const cleanSearch = search?.trim()
    const cleanCategory = category?.trim()

    // Test error simulation (e.g. against /http/500)
    if (status === 500 || status === "500" || cleanSearch === "/http/500" || cleanSearch === "http/500") {
        endpoint = `${DUMMY_JSON_BASE_URL}/http/500`
    } else if (cleanSearch) {
        endpoint = `${DUMMY_JSON_BASE_URL}/products/search`
        queryParams.set("q", cleanSearch)
    } else if (cleanCategory && cleanCategory !== "all") {
        endpoint = `${DUMMY_JSON_BASE_URL}/products/category/${encodeURIComponent(cleanCategory)}`
    }

    if (sortBy) {
        queryParams.set("sortBy", sortBy)
    }

    if (order) {
        queryParams.set("order", order)
    }

    if (select) {
        queryParams.set("select", Array.isArray(select) ? select.join(",") : select)
    }

    if (delay !== undefined && delay !== null && delay !== "") {
        queryParams.set("delay", String(delay))
    }

    const url = endpoint.includes("/http/500")
        ? `${endpoint}${delay ? `?delay=${delay}` : ""}`
        : `${endpoint}?${queryParams.toString()}`

    const response = await fetch(url, { signal })
    if (!response.ok) {
        let errorMessage = `Failed to fetch products: ${response.status} ${response.statusText}`
        try {
            const errorData = await response.json()
            if (errorData?.message) {
                errorMessage = errorData.message
            }
        } catch {
            // ignore non-json response
        }
        throw new Error(errorMessage)
    }

    const data: ProductsResponse = await response.json()

    // Merge persistent stock overrides so adjusted stock levels persist across queries
    data.products = data.products.map(applyStockOverridesToProduct)

    return data
}

/**
 * TanStack Query hook for fetching products list with pagination, filtering, search, and sorting.
 * Cancels obsolete requests via AbortSignal and ensures search never displays stale results from replaced queries.
 */
export function useFetchProducts(
    params: FetchProductsParams = {},
    options?: Omit<UseQueryOptions<ProductsResponse, Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: ({ signal }) => fetchProducts(params, signal),
        placeholderData: (previousData, previousQuery) => {
            // Keep previous data only during page changes within the same search & filter criteria.
            // When search query or filters change, return undefined so fresh loading skeletons are shown immediately.
            if (!previousData || !previousQuery) return undefined
            const prevParams = (previousQuery.queryKey[2] || {}) as FetchProductsParams
            if (
                prevParams.search !== params.search ||
                prevParams.category !== params.category ||
                prevParams.sortBy !== params.sortBy ||
                prevParams.order !== params.order
            ) {
                return undefined
            }
            return previousData
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Fetch single product by ID from DummyJSON
 */
export async function fetchProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    if (String(id) === "500" || String(id) === "http/500") {
        const response = await fetch(`${DUMMY_JSON_BASE_URL}/http/500`, { signal })
        let msg = `HTTP 500 Internal Server Error`
        try {
            const errorData = await response.json()
            if (errorData?.message) msg = errorData.message
        } catch {
            // ignore
        }
        throw new Error(msg)
    }

    const response = await fetch(`${DUMMY_JSON_BASE_URL}/products/${id}`, { signal })
    if (!response.ok) {
        let errorMessage = `Failed to fetch product #${id}: ${response.status} ${response.statusText}`
        try {
            const errorData = await response.json()
            if (errorData?.message) {
                errorMessage = errorData.message
            }
        } catch {
            // ignore
        }
        throw new Error(errorMessage)
    }
    const data: Product = await response.json()
    return applyStockOverridesToProduct(data)
}

/**
 * TanStack Query hook for fetching a single product detail by ID
 */
export function useFetchProduct(
    id: number | string | undefined | null,
    options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: productKeys.detail(id ?? ""),
        queryFn: ({ signal }) => fetchProductById(id!, signal),
        enabled: Boolean(id) && (options?.enabled ?? true),
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}

/**
 * Fetch category list from DummyJSON
 */
export async function fetchCategoryList(signal?: AbortSignal): Promise<string[]> {
    const response = await fetch(`${DUMMY_JSON_BASE_URL}/products/category-list`, { signal })
    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

/**
 * TanStack Query hook for fetching the category list
 */
export function useFetchCategoryList(
    options?: Omit<UseQueryOptions<string[], Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: productKeys.categoryList(),
        queryFn: ({ signal }) => fetchCategoryList(signal),
        staleTime: 1000 * 60 * 60, // 1 hour cache
        ...options,
    })
}

export interface UpdateProductPayload {
    id: number | string
    stock?: number
    title?: string
    price?: number
    description?: string
    availabilityStatus?: string
    [key: string]: unknown
}

/**
 * Update a product (sends PUT /products/{id} to DummyJSON and saves persistent override)
 */
export async function updateProduct({ id, ...payload }: UpdateProductPayload): Promise<Product> {
    try {
        await fetch(`${DUMMY_JSON_BASE_URL}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    } catch (err) {
        console.warn("DummyJSON PUT request failed, continuing with local persistence", err)
    }

    if (payload.stock !== undefined) {
        setStockOverride(id, payload.stock, payload.availabilityStatus as string | undefined)
    }

    return fetchProductById(id)
}

/**
 * TanStack Query mutation hook for updating a product and updating cache + server state
 */
export function useUpdateProduct(
    options?: UseMutationOptions<Product, Error, UpdateProductPayload>
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (data, variables, onMutateResults, context) => {
            // 1. Immediately update specific product detail query in cache
            queryClient.setQueryData(productKeys.detail(data.id), data)

            // 2. Immediately update any active product lists containing this product in cache
            queryClient.setQueriesData<ProductsResponse>(
                { queryKey: productKeys.lists() },
                (old) => {
                    if (!old || !old.products) return old
                    return {
                        ...old,
                        products: old.products.map((p) =>
                            p.id === data.id ? { ...p, ...data } : p
                        ),
                    }
                }
            )

            // 3. Invalidate to trigger background re-sync
            queryClient.invalidateQueries({ queryKey: productKeys.all })

            options?.onSuccess?.(data, variables,onMutateResults, context)
        },
        ...options,
    })
}
