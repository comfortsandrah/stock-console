"use client"

import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Barcode,
    Boxes,
    Building2,
    Check,
    CheckCircle2,
    Copy,
    Edit3,
    MessageSquare,
    Minus,
    Package,
    Plus,
    RefreshCw,
    RotateCcw,
    Ruler,
    Scale,
    Share2,
    ShieldCheck,
    Star,
    Tag,
    Truck,
    XCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { use, useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { useFetchProduct, useUpdateProduct } from "@/lib/hooks/useFetchProducts"
import { getProductById, updateProductStock } from "@/lib/products-data"
import { Product } from "@/types/product"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const productId = Number(resolvedParams.id)

    const {
        data: apiProduct,
        isLoading: isQueryLoading,
        isError,
        error,
        refetch,
    } = useFetchProduct(productId)
    const updateProductMutation = useUpdateProduct()

    const [localProduct, setLocalProduct] = useState<Product | undefined>(undefined)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    // Stock adjustment state
    const [isAdjustingStock, setIsAdjustingStock] = useState(false)
    const [customStockInput, setCustomStockInput] = useState<string | null>(null)
    const [adjustmentReason, setAdjustmentReason] = useState("Physical Recount")
    const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false)

    // Derive active product: local override -> apiProduct -> local fallback mock
    const fallbackProduct = !apiProduct && !isQueryLoading && !isError ? getProductById(productId) : undefined
    const product = localProduct ?? apiProduct ?? fallbackProduct
    const newStockInput = customStockInput ?? (product ? String(product.stock) : "0")

    useEffect(() => {
        const handleStockUpdated = () => {
            const found = getProductById(productId)
            if (found) {
                setLocalProduct(found)
            }
        }

        window.addEventListener("stock_updated", handleStockUpdated)
        return () => {
            window.removeEventListener("stock_updated", handleStockUpdated)
        }
    }, [productId])

    if (isQueryLoading && !product) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="py-12 max-w-lg mx-auto">
                <Card className="border-destructive/40 bg-destructive/5 shadow-md">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertCircle className="size-6" />
                        </div>
                        <CardTitle className="text-base font-bold text-destructive">
                            Failed to Load Product #{productId}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            {error instanceof Error
                                ? error.message
                                : "A server error occurred while retrieving this product. Please retry or return to inventory."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                                refetch()
                            }}
                            className="w-full sm:w-auto h-8 gap-1.5 text-xs font-semibold"
                        >
                            <RefreshCw className="size-3.5" />
                            <span>Retry Request</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href="/products" className="inline-flex items-center gap-1.5 w-full sm:w-auto justify-center" />}
                            className="w-full sm:w-auto h-8 text-xs"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Return to Inventory</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Empty State (Product not found)
    if (!product) {
        return (
            <div className="py-12">
                <Empty className="border-0">
                    <EmptyMedia variant="icon">
                        <Package className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyHeader>
                        <EmptyTitle>Product not found</EmptyTitle>
                        <EmptyDescription>
                            We couldn&apos;t find a product with ID #{productId}. It may have been removed or the link is invalid.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            variant="outline"
                            size="sm"
                            render={<Link href="/products" className="inline-flex items-center gap-1.5" />}
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Return to Inventory</span>
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        )
    }

    const allImages = [product.thumbnail, ...(product.images || [])]
    const currentImage = allImages[selectedImageIndex] || product.thumbnail

    // Calculate original price before discount
    const originalPrice = product.discountPercentage > 0
        ? product.price / (1 - product.discountPercentage / 100)
        : product.price

    // Calculate rating stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-3.5 ${star <= Math.round(rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                    />
                ))}
            </div>
        )
    }

    // Status styling
    const getStatusDetails = (status: string) => {
        if (status === "In Stock") {
            return {
                badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
                dotStyle: "bg-emerald-500",
                icon: <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />,
            }
        }
        if (status === "Low Stock") {
            return {
                badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
                dotStyle: "bg-amber-500",
                icon: <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />,
            }
        }
        return {
            badgeStyle: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
            dotStyle: "bg-rose-500",
            icon: <XCircle className="size-3.5 text-rose-600 dark:text-rose-400" />,
        }
    }

    const statusInfo = getStatusDetails(product.availabilityStatus)

    // Handlers
    const handleCopySku = () => {
        navigator.clipboard.writeText(product.sku)
        toast.add({
            title: "SKU Copied",
            description: `Copied ${product.sku} to clipboard`,
            type: "success",
        })
    }

    const handleCopyBarcode = () => {
        navigator.clipboard.writeText(product.meta.barcode)
        toast.add({
            title: "Barcode Copied",
            description: `Copied ${product.meta.barcode} to clipboard`,
            type: "success",
        })
    }

    const handleShareLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href)
            toast.add({
                title: "Link Copied",
                description: "Product link copied to clipboard",
                type: "success",
            })
        }
    }

    const handleSaveStockAdjustment = async (e: React.FormEvent) => {
        e.preventDefault()
        const parsed = parseInt(newStockInput, 10)

        if (isNaN(parsed) || parsed < 0) {
            toast.add({
                title: "Invalid Stock Quantity",
                description: "Please enter a valid non-negative integer quantity.",
                type: "error",
            })
            return
        }

        setIsSubmittingAdjustment(true)

        try {
            const updated = await updateProductMutation.mutateAsync({ id: product.id, stock: parsed })
            if (updated) {
                setLocalProduct(updated)
            }
        } catch {
            const updated = updateProductStock(product.id, parsed)
            if (updated) {
                setLocalProduct(updated)
            } else {
                setLocalProduct((prev) =>
                    prev
                        ? {
                            ...prev,
                            stock: parsed,
                            availabilityStatus:
                                parsed === 0
                                    ? "Out of Stock"
                                    : parsed < 10
                                        ? "Low Stock"
                                        : "In Stock",
                        }
                        : undefined
                )
            }
        }

        setCustomStockInput(null)
        setIsAdjustingStock(false)
        setIsSubmittingAdjustment(false)

        toast.add({
            title: "Stock Count Updated",
            description: `Stock for ${product.title} updated to ${parsed} units (${adjustmentReason}).`,
            type: "success",
        })
    }

    return (
        <div className="space-y-4 pb-8">
            {/* Top Back Navigation & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
                <Link
                    href="/products"
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Inventory</span>
                </Link>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareLink}
                        className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Share2 className="size-3.5" />
                        <span>Share</span>
                    </Button>

                    <Button
                        variant={isAdjustingStock ? "secondary" : "default"}
                        size="sm"
                        onClick={() => {
                            if (!isAdjustingStock && product) {
                                setCustomStockInput(String(product.stock))
                            } else {
                                setCustomStockInput(null)
                            }
                            setIsAdjustingStock(!isAdjustingStock)
                        }}
                        className="h-8 gap-1.5 px-3 text-xs font-medium"
                    >
                        <Edit3 className="size-3.5" />
                        <span>{isAdjustingStock ? "Cancel Adjustment" : "Adjust Stock"}</span>
                    </Button>
                </div>
            </div>

            {/* Adjust Stock Panel (Collapsible / Action Banner) */}
            {isAdjustingStock && (
                <Card className="border-primary/40 bg-primary/5 shadow-sm animate-in fade-in-50 duration-200">
                    <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                                    <Edit3 className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-semibold text-foreground">
                                        Adjust Physical Stock Count
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        Update the system inventory count after physical verification or delivery reconciliation.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-1">
                        <form onSubmit={handleSaveStockAdjustment} className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="current-stock" className="text-[11px] font-medium text-muted-foreground">
                                    Current System Count
                                </Label>
                                <div className="h-8 flex items-center px-3 rounded-lg border bg-muted/40 font-mono text-xs font-semibold">
                                    {product.stock} units
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="new-stock" className="text-[11px] font-medium text-foreground">
                                    Physically Counted Units *
                                </Label>
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-xs"
                                        className="size-8"
                                        disabled={isSubmittingAdjustment}
                                        onClick={() => {
                                            const current = parseInt(newStockInput || "0", 10)
                                            if (current > 0) setCustomStockInput(String(current - 1))
                                        }}
                                    >
                                        <Minus className="size-3" />
                                    </Button>
                                    <Input
                                        id="new-stock"
                                        type="number"
                                        min="0"
                                        value={newStockInput}
                                        onChange={(e) => setCustomStockInput(e.target.value)}
                                        disabled={isSubmittingAdjustment}
                                        className="h-8 w-24 text-center font-mono text-xs font-bold"
                                        required
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-xs"
                                        className="size-8"
                                        disabled={isSubmittingAdjustment}
                                        onClick={() => {
                                            const current = parseInt(newStockInput || "0", 10)
                                            setCustomStockInput(String((isNaN(current) ? 0 : current) + 1))
                                        }}
                                    >
                                        <Plus className="size-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1 min-w-[160px] flex-1">
                                <Label htmlFor="reason" className="text-[11px] font-medium text-muted-foreground">
                                    Adjustment Reason
                                </Label>
                                <select
                                    id="reason"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    disabled={isSubmittingAdjustment}
                                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                >
                                    <option value="Physical Recount">Physical Recount</option>
                                    <option value="Stock Inflow / Shipment Received">Stock Inflow / Shipment Received</option>
                                    <option value="Damaged / Expired Disposal">Damaged / Expired Disposal</option>
                                    <option value="Clinical Dispense Correction">Clinical Dispense Correction</option>
                                    <option value="Audit Reconciliation">Audit Reconciliation</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isSubmittingAdjustment}
                                    className="h-8 gap-1.5 px-3 text-xs"
                                >
                                    {isSubmittingAdjustment ? (
                                        <>
                                            <div className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            <span>Saving Correction...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="size-3.5" />
                                            <span>Confirm Correction</span>
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={isSubmittingAdjustment}
                                    onClick={() => {
                                        setCustomStockInput(null)
                                        setIsAdjustingStock(false)
                                    }}
                                    className="h-8 text-xs text-muted-foreground"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Main Product Hero Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* Left: Product Media Gallery */}
                <div className="lg:col-span-5 space-y-2.5">
                    <Card className="border-border/60 overflow-hidden shadow-2xs">
                        <CardContent className="p-3">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted/30 flex items-center justify-center">
                                <Image
                                    src={currentImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-4 transition-all duration-200 hover:scale-105"
                                    priority
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement
                                        target.src = "https://placehold.co/500x500?text=Product+Image"
                                    }}
                                />
                                {product.discountPercentage > 0 && (
                                    <div className="absolute top-2.5 left-2.5">
                                        <Badge variant="destructive" className="font-semibold text-[10px] px-1.5 py-0 h-5">
                                            {product.discountPercentage}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Switcher */}
                            {allImages.length > 1 && (
                                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Product image thumbnails">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(idx)}
                                            aria-label={`View image ${idx + 1} of ${product.title}`}
                                            aria-selected={selectedImageIndex === idx}
                                            role="tab"
                                            className={`relative size-14 shrink-0 overflow-hidden rounded-md border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${selectedImageIndex === idx
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-border/60 opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Barcode & Identifiers Card */}
                    <Card className="border-border/60 shadow-2xs">
                        <CardContent className="p-3 space-y-2">
                            <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                <Barcode className="size-3.5 text-muted-foreground" />
                                <span>Identification & Tracking</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-md bg-muted/40 border border-border/50">
                                    <span className="text-[10px] text-muted-foreground block">Product ID</span>
                                    <span className="font-mono font-bold text-foreground">#{product.id}</span>
                                </div>
                                <div className="p-2 rounded-md bg-muted/40 border border-border/50">
                                    <span className="text-[10px] text-muted-foreground block">SKU Code</span>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-medium text-foreground truncate">{product.sku}</span>
                                        <button onClick={handleCopySku} className="text-muted-foreground hover:text-foreground">
                                            <Copy className="size-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-2 p-2 rounded-md bg-muted/40 border border-border/50 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Barcode (EAN-13)</span>
                                        <span className="font-mono text-xs font-semibold text-foreground">{product.meta.barcode}</span>
                                    </div>
                                    <button onClick={handleCopyBarcode} className="text-muted-foreground hover:text-foreground">
                                        <Copy className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Product Details & Stock Highlights */}
                <div className="lg:col-span-7 space-y-3">
                    <Card className="border-border/60 shadow-2xs">
                        <CardContent className="p-4 space-y-3.5">
                            {/* Header details */}
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge variant="secondary" className="capitalize text-[11px] px-1.5 py-0 h-5">
                                        {product.category}
                                    </Badge>
                                    {product.brand && (
                                        <Badge variant="outline" className="text-[11px] px-1.5 py-0 h-5 text-muted-foreground">
                                            <Building2 className="size-2.5 mr-1" />
                                            {product.brand}
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                                    {product.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                                    <div className="flex items-center gap-1.5">
                                        {renderStars(product.rating)}
                                        <span className="text-xs font-bold text-foreground">{product.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        ({product.reviews?.length || 0} clinic review{product.reviews?.length === 1 ? "" : "s"})
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            {/* Price & Current Inventory Banner */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Price Box */}
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                                    <span className="text-[11px] text-muted-foreground font-medium block">Unit Price</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold font-mono text-foreground">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {product.discountPercentage > 0 && (
                                            <span className="text-xs font-mono text-muted-foreground line-through">
                                                ${originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Min order: <span className="font-medium text-foreground">{product.minimumOrderQuantity} units</span>
                                    </p>
                                </div>

                                {/* Stock Box */}
                                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-muted-foreground font-medium">Stock Status</span>
                                        <Badge variant="outline" className={`text-[11px] px-1.5 py-0 h-5 font-medium ${statusInfo.badgeStyle}`}>
                                            <span className={`size-1.5 rounded-full mr-1 ${statusInfo.dotStyle}`} />
                                            {product.availabilityStatus}
                                        </Badge>
                                    </div>
                                    <div className="flex items-baseline gap-1.5 pt-0.5">
                                        <span className={`text-2xl font-bold font-mono ${product.stock === 0 ? "text-destructive" : "text-foreground"}`}>
                                            {product.stock.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-sans">units available</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                        Last count: {new Date(product.meta.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <h2 className="text-xs font-semibold text-foreground">Description</h2>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>

                            {/* Product Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <h2 className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                                        <Tag className="size-3 text-muted-foreground" />
                                        <span>Clinical Classification Tags</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-1">
                                        {product.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-[10px] px-1.5 py-0 h-4 bg-muted/60 text-muted-foreground"
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Logistics, Dimensions & Warranty Specifications */}
                    <Card className="border-border/60 shadow-2xs">
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <Boxes className="size-3.5 text-muted-foreground" />
                                <span>Specifications & Logistics</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-md bg-muted/30 border border-border/50 flex items-start gap-2">
                                    <Scale className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Weight</span>
                                        <span className="font-medium text-foreground">{product.weight} kg</span>
                                    </div>
                                </div>

                                <div className="p-2 rounded-md bg-muted/30 border border-border/50 flex items-start gap-2">
                                    <Ruler className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Dimensions (W×H×D)</span>
                                        <span className="font-medium text-foreground font-mono">
                                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                                        </span>
                                    </div>
                                </div>

                                <div className="p-2 rounded-md bg-muted/30 border border-border/50 flex items-start gap-2">
                                    <ShieldCheck className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Warranty & Shelf Life</span>
                                        <span className="font-medium text-foreground">{product.warrantyInformation}</span>
                                    </div>
                                </div>

                                <div className="p-2 rounded-md bg-muted/30 border border-border/50 flex items-start gap-2">
                                    <Truck className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Shipping Guarantee</span>
                                        <span className="font-medium text-foreground">{product.shippingInformation}</span>
                                    </div>
                                </div>

                                <div className="col-span-2 p-2 rounded-md bg-muted/30 border border-border/50 flex items-start gap-2">
                                    <RotateCcw className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-muted-foreground block">Return Policy</span>
                                        <span className="font-medium text-foreground">{product.returnPolicy}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* User Reviews Section */}
            <Card className="border-border/60 shadow-2xs">
                <CardHeader className="p-3.5 pb-2 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <MessageSquare className="size-4 text-muted-foreground" />
                            <span>User Reviews</span>
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                            Real-world user reviews.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                            ★ {product.rating.toFixed(1)} / 5.0
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-3.5 pt-1 space-y-2.5">
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                            {product.reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2 transition-all hover:bg-muted/30"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                {review.reviewerName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-xs text-foreground leading-tight">
                                                    {review.reviewerName}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate">
                                                    {review.reviewerEmail}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {renderStars(review.rating)}
                                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                {new Date(review.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed text-muted-foreground italic">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-6 text-center text-xs text-muted-foreground">
                            No reviews have been submitted for this item yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}