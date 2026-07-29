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
    maxPrice: Number(searchParams.get('maxPrice')) || 500,
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
      if (filters.maxPrice < 500) params.set('maxPrice', String(filters.maxPrice));
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
    setFilters({ category: '', minPrice: 0, maxPrice: 500, color: '', size: '', sort: 'newest' });
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.color || filters.size || filters.sort !== 'newest' || searchQuery;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-1 text-muted-foreground">Discover our premium collection</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchBar onClose={() => {}} />
        </div>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
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
            <span className="inline-flex items-center gap-1 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Category: {filters.category}
              <button onClick={() => handleFilterChange({ ...filters, category: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.color && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Color: {filters.color}
              <button onClick={() => handleFilterChange({ ...filters, color: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.size && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Size: {filters.size}
              <button onClick={() => handleFilterChange({ ...filters, size: '' })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-accent px-3 py-1 text-xs font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => handleSearch('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="min-w-[36px]"
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
