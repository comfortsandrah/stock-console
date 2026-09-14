import { describe, it, expect, beforeEach } from "vitest"
import {
    setStockOverride,
    getStockOverrides,
    applyStockOverridesToProduct,
} from "@/lib/hooks/useFetchProducts"
import type { Product } from "@/types/product"

describe("Stock Overrides & Status Logic", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    const sampleProduct: Product = {
        id: 10,
        title: "Surgical Gloves Latex Box",
        description: "Standard medical examination gloves",
        category: "medical-supplies",
        price: 19.99,
        discountPercentage: 0,
        rating: 4.8,
        stock: 50,
        tags: ["gloves", "sterile"],
        brand: "MedSupply",
        sku: "MED-GLV-010",
        weight: 1.2,
        dimensions: { width: 10, height: 15, depth: 5 },
        warrantyInformation: "1 year",
        shippingInformation: "Ships in 24 hours",
        availabilityStatus: "In Stock",
        reviews: [],
        returnPolicy: "30-day return policy",
        minimumOrderQuantity: 1,
        meta: {
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
            barcode: "1234567890123",
            qrCode: "https://example.com/qr",
        },
        images: ["/img.jpg"],
        thumbnail: "/thumb.jpg",
    }

    it("computes 'Out of Stock' status when stock is 0", () => {
        const override = setStockOverride(10, 0)
        expect(override.stock).toBe(0)
        expect(override.availabilityStatus).toBe("Out of Stock")

        const merged = applyStockOverridesToProduct(sampleProduct)
        expect(merged.stock).toBe(0)
        expect(merged.availabilityStatus).toBe("Out of Stock")
    })

    it("computes 'Low Stock' status when stock is between 1 and 9", () => {
        const override = setStockOverride(10, 5)
        expect(override.stock).toBe(5)
        expect(override.availabilityStatus).toBe("Low Stock")

        const merged = applyStockOverridesToProduct(sampleProduct)
        expect(merged.stock).toBe(5)
        expect(merged.availabilityStatus).toBe("Low Stock")
    })

    it("computes 'In Stock' status when stock is 10 or greater", () => {
        const override = setStockOverride(10, 120)
        expect(override.stock).toBe(120)
        expect(override.availabilityStatus).toBe("In Stock")

        const merged = applyStockOverridesToProduct(sampleProduct)
        expect(merged.stock).toBe(120)
        expect(merged.availabilityStatus).toBe("In Stock")
    })

    it("persists multiple product overrides in localStorage store", () => {
        setStockOverride(1, 0)
        setStockOverride(2, 4)
        setStockOverride(3, 85)

        const allOverrides = getStockOverrides()
        expect(allOverrides["1"]?.stock).toBe(0)
        expect(allOverrides["2"]?.stock).toBe(4)
        expect(allOverrides["3"]?.stock).toBe(85)
    })
})
