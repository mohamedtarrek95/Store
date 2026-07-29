'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/types';
import { RotateCcw, X, SlidersHorizontal } from 'lucide-react';

interface Filters {
  category: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  size: string;
  sort: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClose?: () => void;
}

const colors = [
  { name: 'Gold', value: 'gold' },
  { name: 'Silver', value: 'silver' },
  { name: 'Rose Gold', value: 'rosegold' },
  { name: 'Black', value: 'black' },
  { name: 'White', value: 'white' },
];

const sizes = ['Small', 'Medium', 'Large'];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

export function ProductFilters({ filters, onFilterChange, onClose }: ProductFiltersProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [priceMin, setPriceMin] = useState(filters.minPrice || 0);
  const [priceMax, setPriceMax] = useState(filters.maxPrice || 1000);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPriceMin(filters.minPrice || 0);
    setPriceMax(filters.maxPrice || 1000);
  }, [filters.minPrice, filters.maxPrice]);

  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      color: '',
      size: '',
      sort: 'newest',
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.color,
    filters.size,
    filters.minPrice > 0 || filters.maxPrice < 1000,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="mt-2 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
        <div className="mt-3 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', filters.category === cat.slug ? '' : cat.slug)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                filters.category === cat.slug ? 'bg-accent font-medium' : ''
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  filters.category === cat.slug ? 'border-foreground bg-foreground' : 'border-input'
                }`}
              >
                {filters.category === cat.slug && <div className="h-2 w-2 rounded-sm bg-background" />}
              </div>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </label>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceMin(Math.min(v, priceMax - 10));
              }}
              onMouseUp={() => onFilterChange({ ...filters, minPrice: priceMin, maxPrice: priceMax })}
              className="flex-1 accent-foreground"
            />
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceMax(Math.max(v, priceMin + 10));
              }}
              onMouseUp={() => onFilterChange({ ...filters, minPrice: priceMin, maxPrice: priceMax })}
              className="flex-1 accent-foreground"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceMin}</span>
            <span>${priceMax}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateFilter('color', filters.color === color.value ? '' : color.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.color === color.value
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-input hover:border-foreground/50'
              }`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('size', filters.size === size.toLowerCase() ? '' : size.toLowerCase())}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filters.size === size.toLowerCase()
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-input hover:border-foreground/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
