'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, X, ImageIcon, GripVertical } from 'lucide-react';
import { CategoryType } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  featured: z.boolean().default(false),
  sale: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
  productId?: string;
}

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [serverError, setServerError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      comparePrice: undefined,
      category: '',
      brand: '',
      sku: '',
      stock: 0,
      featured: false,
      sale: false,
      rating: undefined,
    },
  });

  const featured = watch('featured');
  const sale = watch('sale');

  useEffect(() => {
    fetchCategories();
    if (initialData) populateForm(initialData);
  }, [initialData]);

  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error('Failed to load categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const populateForm = (data: any) => {
    setValue('name', data.name || '');
    setValue('description', data.description || '');
    setValue('price', data.price || undefined);
    setValue('comparePrice', data.comparePrice || undefined);
    setValue('category', data.category?._id || data.category || '');
    setValue('brand', data.brand || '');
    setValue('sku', data.sku || '');
    setValue('stock', data.stock ?? 0);
    setValue('featured', data.featured || false);
    setValue('sale', data.sale || false);
    setValue('rating', data.rating || undefined);
    if (data.images?.length) setImageUrls(data.images);
  };

  const addImage = () => setImageUrls((prev) => [...prev, '']);
  const removeImage = (index: number) => {
    setImageUrls((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };
  const updateImage = (index: number, value: string) => {
    setImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setServerError('');
    const validImages = imageUrls.filter((url) => url.trim());
    if (!validImages.length) {
      setServerError('At least one image URL is required');
      return;
    }

    try {
      const payload = {
        ...data,
        images: validImages,
        featuredImage: validImages[0],
        colors: [],
        sizes: [],
        discountPrice: data.sale ? data.comparePrice : undefined,
      };

      const url = isEditing && productId ? `/api/products/${productId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Product name, description, and brand</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} placeholder="Product name" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Product description"
                rows={5}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register('brand')} placeholder="Brand name" />
                {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register('sku')} placeholder="SKU" />
                {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
              <p className="text-sm text-muted-foreground">Price, stock, and category</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price')}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">
                  Compare Price ($) <span className="text-muted-foreground text-xs">(original)</span>
                </Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  {...register('comparePrice')}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={watch('category')}
                  onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categoryLoading ? 'Loading...' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" {...register('stock')} placeholder="0" />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Images</h3>
              <p className="text-sm text-muted-foreground">Add product image URLs</p>
            </div>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    {url.trim() ? (
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Input
                    value={url}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(index)}
                    disabled={imageUrls.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                <Plus className="h-4 w-4 mr-2" /> Add Image
              </Button>
              {imageUrls.filter((u) => u.trim()).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {imageUrls
                    .filter((u) => u.trim())
                    .map((img, i) => (
                      <div
                        key={i}
                        className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-primary/30"
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Rating</h3>
              <p className="text-sm text-muted-foreground">Optional average rating (0-5)</p>
            </div>
            <div className="space-y-2 max-w-[200px]">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register('rating')}
                placeholder="4.5"
              />
              {errors.rating && <p className="text-xs text-red-500">{errors.rating.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <p className="text-sm text-muted-foreground">Product visibility and flags</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured" className="font-medium">Featured</Label>
                <p className="text-xs text-muted-foreground">Show as featured product</p>
              </div>
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={(v) => setValue('featured', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sale" className="font-medium">Sale</Label>
                <p className="text-xs text-muted-foreground">Enable sale pricing</p>
              </div>
              <Switch
                id="sale"
                checked={sale}
                onCheckedChange={(v) => setValue('sale', v)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
