import { describe, it, expect } from "vitest"

describe("Pagination Math & Boundary Clamping Logic", () => {
    it("calculates total pages and slice boundaries accurately", () => {
        const totalItems = 194
        const limit = 20
        const totalPages = Math.max(1, Math.ceil(totalItems / limit))
        expect(totalPages).toBe(10)

        // Page 1
        const page1 = 1
        const firstItem1 = (page1 - 1) * limit + 1
        const lastItem1 = Math.min(page1 * limit, totalItems)
        expect(firstItem1).toBe(1)
        expect(lastItem1).toBe(20)

        // Last Page (Page 10)
        const page10 = 10
        const firstItem10 = (page10 - 1) * limit + 1
        const lastItem10 = Math.min(page10 * limit, totalItems)
        expect(firstItem10).toBe(181)
        expect(lastItem10).toBe(194)
    })

    it("clamps out-of-bounds page requests safely", () => {
        const totalItems = 30
        const limit = 10
        const totalPages = Math.max(1, Math.ceil(totalItems / limit)) // 3
        const requestedPage = 99

        const safePage = Math.min(Math.max(1, requestedPage), totalPages)
        expect(safePage).toBe(3)
    })

    it("handles zero items without negative indices", () => {
        const totalItems = 0
        const limit = 10
        const totalPages = Math.max(1, Math.ceil(totalItems / limit))
        expect(totalPages).toBe(1)

        const firstItem = totalItems === 0 ? 0 : 1
        const lastItem = Math.min(limit, totalItems)
        expect(firstItem).toBe(0)
        expect(lastItem).toBe(0)
    })
})
