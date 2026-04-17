'use client'

import { useState } from 'react'
import type { Category } from '@/store/api/categoriesApi'

export interface FilterState {
  priceRange: [number, number]
  sortBy: 'default' | 'asc' | 'desc'
  inStock: boolean
  discountOnly: boolean
  minDiscount: number
  pvRange: [number, number]
  search: string
  hasPvOnly: boolean
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void
  className?: string
  pvRange?: [number, number]
  search?: string
  categories?: Category[]
  currentCategory?: string
}

export default function ProductFilter({ onFilterChange, className = '', pvRange: propPvRange = [0, 5000], search: propSearch = '', categories = [], currentCategory }: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState<'default' | 'asc' | 'desc'>('default')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [discountOnly, setDiscountOnly] = useState(false)
  const [minDiscount, setMinDiscount] = useState(0)
  const [pvRange, setPvRange] = useState<[number, number]>(propPvRange)
  const [hasPvOnly, setHasPvOnly] = useState(false)
  const [showPvInfo, setShowPvInfo] = useState(false)

  const discountPresets = [
    { label: '10% or more', value: 10 },
    { label: '20% or more', value: 20 },
    { label: '30% or more', value: 30 },
    { label: '50% or more', value: 50 },
  ]

  const pricePresets = [
    { label: 'Under ₱1,000', min: 0, max: 1000 },
    { label: '₱1,000 - ₱5,000', min: 1000, max: 5000 },
    { label: '₱5,000 - ₱10,000', min: 5000, max: 10000 },
    { label: 'Over ₱10,000', min: 10000, max: 999999 },
  ]

  const pvPresets = [
    { label: 'Under 500 PV', min: 0, max: 500 },
    { label: '500 - 1000 PV', min: 500, max: 1000 },
    { label: '1000 - 2000 PV', min: 1000, max: 2000 },
    { label: 'Over 2000 PV', min: 2000, max: 5000 },
  ]


  const handlePriceChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max]
    setPriceRange(newRange)
    onFilterChange({
      priceRange: newRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handleSortChange = (newSort: 'default' | 'asc' | 'desc') => {
    setSortBy(newSort)
    onFilterChange({
      priceRange,
      sortBy: newSort,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handleInStockToggle = () => {
    const newInStock = !inStockOnly
    setInStockOnly(newInStock)
    onFilterChange({
      priceRange,
      sortBy,
      inStock: newInStock,
      discountOnly,
      minDiscount,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handleDiscountToggle = () => {
    const newDiscountOnly = !discountOnly
    setDiscountOnly(newDiscountOnly)
    // Reset minDiscount to 0 when unchecking discountOnly
    const newMinDiscount = newDiscountOnly ? minDiscount : 0
    if (!newDiscountOnly) {
      setMinDiscount(newMinDiscount)
    }
    onFilterChange({
      priceRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly: newDiscountOnly,
      minDiscount: newMinDiscount,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handleDiscountPercentageChange = (percentage: number) => {
    setMinDiscount(percentage)
    onFilterChange({
      priceRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount: percentage,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handleRangeInputChange = (type: 'min' | 'max', value: number) => {
    const newMin = type === 'min' ? value : priceRange[0]
    const newMax = type === 'max' ? value : priceRange[1]

    if (newMin <= newMax) {
      handlePriceChange(newMin, newMax)
    }
  }

  const handlePresetClick = (preset: { min: number; max: number }) => {
    setPriceRange([preset.min, preset.max])
    onFilterChange({
      priceRange: [preset.min, preset.max],
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handlePvRangeChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max]
    setPvRange(newRange)
    onFilterChange({
      priceRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange: newRange,
      search: propSearch,
      hasPvOnly
    })
  }

  const handlePvRangeInputChange = (type: 'min' | 'max', value: number) => {
    const newMin = type === 'min' ? value : pvRange[0]
    const newMax = type === 'max' ? value : pvRange[1]

    if (newMin <= newMax) {
      handlePvRangeChange(newMin, newMax)
    }
  }

  const handlePvPresetClick = (preset: { min: number; max: number }) => {
    setPvRange([preset.min, preset.max])
    onFilterChange({
      priceRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange: [preset.min, preset.max],
      search: propSearch,
      hasPvOnly
    })
  }

  const handleHasPvOnlyToggle = () => {
    const newHasPvOnly = !hasPvOnly
    setHasPvOnly(newHasPvOnly)
    // Reset pvRange to default when unchecking hasPvOnly
    const newPvRange: [number, number] = newHasPvOnly ? pvRange : [0, 5000]
    if (!newHasPvOnly) {
      setPvRange(newPvRange)
    }
    onFilterChange({
      priceRange,
      sortBy,
      inStock: inStockOnly,
      discountOnly,
      minDiscount,
      pvRange: newPvRange,
      search: propSearch,
      hasPvOnly: newHasPvOnly
    })
  }


  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Filters</h3>

      {/* Category Filter for Category Page Only - Only show when categories exist */}
      {categories && categories.length > 0 && (
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Shop Category</h4>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => onFilterChange({ ...{ priceRange, sortBy, inStock: inStockOnly, discountOnly, minDiscount, pvRange, search: '', hasPvOnly } })}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              !currentCategory && !propSearch ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onFilterChange({ ...{ priceRange, sortBy, inStock: inStockOnly, discountOnly, minDiscount, pvRange, search: category.name, hasPvOnly } })}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                currentCategory === category.name || propSearch === category.name
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      )}


      {/* Price Range Filter */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Price Range</h4>

        {/* Custom Range Inputs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-1">
            <label className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 block mb-1">Min</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handleRangeInputChange('min', Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
            />
          </div>
          <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
          <div className="flex-1">
            <label className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 block mb-1">Max</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handleRangeInputChange('max', Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="10000"
            />
          </div>
        </div>

        {/* Price Presets */}
        <div className="space-y-1.5 sm:space-y-2">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                priceRange[0] === preset.min && priceRange[1] === preset.max
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Sort By Name</h4>
        <div className="space-y-1.5 sm:space-y-2">
          <button
            onClick={() => handleSortChange('default')}
            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              sortBy === 'default'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            Default
          </button>
          <button
            onClick={() => handleSortChange('asc')}
            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              sortBy === 'asc'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            A to Z
          </button>
          <button
            onClick={() => handleSortChange('desc')}
            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              sortBy === 'desc'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
            }`}
          >
            Z to A
          </button>
        </div>
      </div>

      {/* Discount Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={handleDiscountToggle}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Discounted Items Only</span>
        </label>
      </div>

      {/* Discount Percentage Filter */}
      {discountOnly && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Min Discount %</h4>
          <div className="space-y-1.5 sm:space-y-2">
            {discountPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleDiscountPercentageChange(preset.value)}
                className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  minDiscount === preset.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Performance Value Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasPvOnly}
            onChange={handleHasPvOnlyToggle}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Has Performance Value</span>
          <div className="relative group flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer flex items-center"
              onMouseEnter={() => setShowPvInfo(true)}
              onMouseLeave={() => setShowPvInfo(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
            {showPvInfo && (
              <div className="absolute bottom-full left-0 mb-1 sm:mb-2 w-40 sm:w-56 bg-gray-900 dark:bg-gray-700 text-white text-[10px] sm:text-xs rounded-lg p-1.5 sm:p-2 z-10">
                <p>PV (Performance Value) represents the earning points you get when you purchase a product. Higher PV means more value earned.</p>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* PV Range Sub-filter */}
      {hasPvOnly && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Min Performance Value</h4>
          <div className="space-y-1.5 sm:space-y-2">
            {pvPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePvPresetClick(preset)}
                className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  pvRange[0] === preset.min && pvRange[1] === preset.max
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Filter */}
      <div className="mb-4 sm:mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={handleInStockToggle}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setPriceRange([0, 10000])
          setSortBy('default')
          setInStockOnly(false)
          setDiscountOnly(false)
          setMinDiscount(0)
          setPvRange(propPvRange)
          setHasPvOnly(false)
          onFilterChange({
            priceRange: [0, 10000],
            sortBy: 'default',
            inStock: false,
            discountOnly: false,
            minDiscount: 0,
            pvRange: propPvRange,
            search: propSearch,
            hasPvOnly: false
          })
        }}
        className="w-full rounded-lg py-2 text-sm font-semibold transition-colors cursor-pointer bg-orange-500 text-white hover:bg-orange-600 dark:hover:bg-orange-600"
      >
        Clear Filters
      </button>
    </div>
  )
}
