'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CategoryType } from '@/types';
import { RotateCcw, X } from 'lucide-react';

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
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 500]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 500]);
  }, [filters.minPrice, filters.maxPrice]);

  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      minPrice: 0,
      maxPrice: 500,
      color: '',
      size: '',
      sort: 'newest',
    });
    setPriceRange([0, 500]);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = () => {
    onFilterChange({ ...filters, minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  const activeFilterCount = [
    filters.category,
    filters.color,
    filters.size,
    filters.minPrice > 0 || filters.maxPrice < 500,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
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

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-medium">Sort By</Label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-medium">Category</Label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
              !filters.category ? 'bg-accent font-medium' : ''
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                filters.category === cat.slug ? 'bg-accent font-medium' : ''
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Price Range (${priceRange[0]} — ${priceRange[1]})
        </Label>
        <div className="px-1">
          <Slider
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-medium">Color</Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('color', '')}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              !filters.color ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            All
          </button>
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateFilter('color', color.value)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filters.color === color.value ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block text-sm font-medium">Size</Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('size', '')}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              !filters.size ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            All
          </button>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('size', size.toLowerCase())}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filters.size === size.toLowerCase() ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
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
