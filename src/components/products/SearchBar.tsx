'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { ProductType } from '@/types';
import { formatPrice } from '@/lib/utils';

interface SearchBarProps {
  onClose?: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setResults(data.products || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      onClose?.();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-13 w-full rounded-2xl border border-input bg-background pl-11 pr-11 text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-popover shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No products found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product._id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setOpen(false);
                      onClose?.();
                    }}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <img
                      src={product.featuredImage || product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t">
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setOpen(false);
                    onClose?.();
                  }}
                  className="block px-4 py-3.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  View all results for &ldquo;{query}&rdquo;
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
