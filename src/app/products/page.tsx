'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductType } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SearchBar } from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X } from 'lucide-react';

interface Filters {
  category: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  size: string;
  sort: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice < 1000) params.set('maxPrice', String(filters.maxPrice));
      if (filters.color) params.set('color', filters.color);
      if (filters.size) params.set('size', filters.size);
      if (filters.sort) params.set('sort', filters.sort);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', String(page));
      params.set('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.color) params.set('color', filters.color);
    if (filters.size) params.set('size', filters.size);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    if (searchQuery) params.set('search', searchQuery);
    const qs = params.toString();
    router.replace(`/products${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [filters, searchQuery, router]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({ category: '', minPrice: 0, maxPrice: 1000, color: '', size: '', sort: 'newest' });
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.color || filters.size || filters.sort !== 'newest' || searchQuery;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">Discover our premium collection</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar onClose={() => {}} />
        </div>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden h-11 rounded-xl">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} onClose={() => setMobileFiltersOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filters.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Category: {filters.category}
              <button onClick={() => handleFilterChange({ ...filters, category: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.color && (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Color: {filters.color}
              <button onClick={() => handleFilterChange({ ...filters, color: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.size && (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Size: {filters.size}
              <button onClick={() => handleFilterChange({ ...filters, size: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => handleSearch('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border p-5">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
            </p>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <ProductGrid products={products} loading={loading} />

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-input px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                    p === page ? 'bg-foreground text-background' : 'border border-input hover:bg-accent'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-input px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
