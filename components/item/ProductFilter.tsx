'use client'

import { useState } from 'react'

export interface FilterState {
  priceRange: [number, number]
  categories: string[]
  ratings: number[]
  inStock: boolean
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void
  className?: string
}

export default function ProductFilter({ onFilterChange, className = '' }: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)

  const categories = [
    'Electronics',
    'Home & Living',
    'Fashion',
    'Beauty',
    'Sports',
    'Toys',
    'Books',
    'Food & Grocery'
  ]

  const handlePriceChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max]
    setPriceRange(newRange)
    onFilterChange({
      priceRange: newRange,
      categories: selectedCategories,
      ratings: selectedRatings,
      inStock: inStockOnly
    })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    onFilterChange({
      priceRange,
      categories: newCategories,
      ratings: selectedRatings,
      inStock: inStockOnly
    })
  }

  const handleRatingToggle = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating]
    setSelectedRatings(newRatings)
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      ratings: newRatings,
      inStock: inStockOnly
    })
  }

  const handleInStockToggle = () => {
    const newInStock = !inStockOnly
    setInStockOnly(newInStock)
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      ratings: selectedRatings,
      inStock: newInStock
    })
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Min</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
            />
          </div>
          <span className="text-gray-400 mt-6">-</span>
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Max</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingToggle(rating)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={star <= rating ? '#f97316' : 'none'}
                    stroke={star <= rating ? '#f97316' : '#d1d5db'}
                    strokeWidth="2"
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-700">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={handleInStockToggle}
            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setPriceRange([0, 10000])
          setSelectedCategories([])
          setSelectedRatings([])
          setInStockOnly(false)
          onFilterChange({
            priceRange: [0, 10000],
            categories: [],
            ratings: [],
            inStock: false
          })
        }}
        className="w-full rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  )
}
