'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight,
  ArrowUpDown, Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { ProductType } from '@/types';

type SortKey = 'name' | 'price' | 'stock' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', sort: sortKey, dir: sortDir });
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, [page, sortKey, sortDir, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    } finally {
      setDeleting(false);
    }
  };

  const SortHeader = ({ label, sortKey: sk }: { label: string; sortKey: SortKey }) => (
    <TableHead>
      <button onClick={() => toggleSort(sk)} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    </TableHead>
  );

  const SkeletonRows = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 8 }).map((_, j) => (
          <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
        ))}
      </TableRow>
    ));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
        <div className="p-6 pb-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
                <SortHeader label="Name" sortKey="name" />
                <TableHead>SKU</TableHead>
                <SortHeader label="Price" sortKey="price" />
                <SortHeader label="Stock" sortKey="stock" />
                <TableHead>Status</TableHead>
                <SortHeader label="Date" sortKey="createdAt" />
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonRows />
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mb-4 opacity-30" />
                      <p className="text-base font-medium">No products found</p>
                      <p className="text-sm mt-1">
                        {search ? 'Try a different search term' : 'Get started by adding your first product'}
                      </p>
                      {!search && (
                        <Button asChild className="mt-4" size="sm">
                          <Link href="/admin/products/new">
                            <Plus className="h-4 w-4 mr-2" /> Add Product
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, i) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=N/A';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <span className="space-x-1.5">
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {formatPrice(product.discountPrice)}
                          </span>
                          <span className="text-muted-foreground line-through text-xs">
                            {formatPrice(product.price)}
                          </span>
                        </span>
                      ) : (
                        <span className="font-medium">{formatPrice(product.price)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stock <= 5
                            ? 'text-amber-600'
                            : ''
                        }`}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            Featured
                          </Badge>
                        )}
                        {product.bestSeller && (
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">
                            Best Seller
                          </Badge>
                        )}
                        {product.newArrival && (
                          <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Out of Stock
                          </Badge>
                        )}
                        {!product.featured && !product.bestSeller && !product.newArrival && product.stock > 0 && (
                          <span className="text-muted-foreground text-xs">&mdash;</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/products/${product._id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product._id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
