import { useMemo } from 'react'

/**
 * Hook and helper utilities for checking stock availability and generating counter badges in the storefront.
 * @param {Array} products - List of product objects
 */
export function useStockCounter(products = []) {
  return useMemo(() => {
    const list = Array.isArray(products) ? products : []
    let totalStockUnits = 0
    let inStockCount = 0
    let outOfStockCount = 0
    let lowStockCount = 0

    for (const p of list) {
      const qty = p.stockQuantity ?? (p.inStock ? 10 : 0)
      totalStockUnits += qty
      if (p.inStock === false || qty <= 0) {
        outOfStockCount++
      } else {
        inStockCount++
        if (qty < 10) {
          lowStockCount++
        }
      }
    }

    return {
      totalStockUnits,
      inStockCount,
      outOfStockCount,
      lowStockCount,
    }
  }, [products])
}

/**
 * Calculates real-time stock availability and badge styling for a product or selected variant.
 * @param {Object} product - Product object
 * @param {Object|null} selectedVariant - Selected product variant object (optional)
 * @returns {Object} { status, label, availableQty, isLowStock, isOutOfStock, badgeBg, badgeText }
 */
export function getStockBadgeInfo(product, selectedVariant = null) {
  if (!product) {
    return { status: 'out_of_stock', label: 'Unavailable', availableQty: 0, isLowStock: false, isOutOfStock: true, badgeBg: 'bg-red-50 text-red-600 border-red-200', badgeText: 'Out of Stock' }
  }

  const variantQty = selectedVariant?.stockQuantity
  const baseQty = product.stockQuantity
  const availableQty = variantQty ?? baseQty ?? (product.inStock ? 10 : 0)

  const isOutOfStock = product.inStock === false || availableQty <= 0
  const isLowStock = !isOutOfStock && availableQty > 0 && availableQty < 10

  if (isOutOfStock) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      availableQty: 0,
      isLowStock: false,
      isOutOfStock: true,
      badgeBg: 'bg-red-50 text-red-600 border border-red-200',
      badgeText: 'Sold Out'
    }
  }

  if (isLowStock) {
    return {
      status: 'low_stock',
      label: `Only ${availableQty} left in stock - order soon`,
      availableQty,
      isLowStock: true,
      isOutOfStock: false,
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      badgeText: `Low Stock: ${availableQty} left`
    }
  }

  return {
    status: 'in_stock',
    label: `In Stock (${availableQty} available)`,
    availableQty,
    isLowStock: false,
    isOutOfStock: false,
    badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    badgeText: 'In Stock'
  }
}
