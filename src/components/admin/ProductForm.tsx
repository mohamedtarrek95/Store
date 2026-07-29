'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { CategoryType } from '@/types';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
  productId?: string;
}

export default function ProductForm({ initialData, isEditing, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    sku: '',
    stock: '',
    images: [''] as string[],
    featuredImage: '',
    colors: '',
    sizes: '',
    brand: '',
    featured: false,
    bestSeller: false,
    newArrival: false,
  });

  useEffect(() => {
    fetchCategories();
    if (initialData) populateForm(initialData);
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error('Failed to load categories');
    }
  };

  const populateForm = (data: any) => {
    setForm({
      name: data.name || '',
      description: data.description || '',
      category: data.category?._id || data.category || '',
      price: String(data.price || ''),
      discountPrice: data.discountPrice ? String(data.discountPrice) : '',
      sku: data.sku || '',
      stock: String(data.stock ?? ''),
      images: data.images?.length ? data.images : [''],
      featuredImage: data.featuredImage || '',
      colors: data.colors?.join(', ') || '',
      sizes: data.sizes?.join(', ') || '',
      brand: data.brand || '',
      featured: data.featured || false,
      bestSeller: data.bestSeller || false,
      newArrival: data.newArrival || false,
    });
  };

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addImageField = () => {
    setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setForm(prev => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: images.length ? images : [''] };
    });
  };

  const updateImage = (index: number, value: string) => {
    setForm(prev => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.category) return 'Category is required';
    if (!form.price || isNaN(Number(form.price))) return 'Valid price is required';
    if (!form.sku.trim()) return 'SKU is required';
    if (form.stock === '' || isNaN(Number(form.stock))) return 'Valid stock quantity is required';
    if (!form.brand.trim()) return 'Brand is required';
    const validImages = form.images.filter(img => img.trim());
    if (!validImages.length) return 'At least one image URL is required';
    if (!form.featuredImage.trim()) return 'Featured image URL is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const validImages = form.images.filter(img => img.trim());
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        stock: parseInt(form.stock, 10),
        images: validImages,
        colors: form.colors,
        sizes: form.sizes,
      };

      const url = isEditing && productId ? `/api/products/${productId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="Product name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Product description" rows={5} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" value={form.brand} onChange={e => updateField('brand', e.target.value)} placeholder="Brand name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={form.sku} onChange={e => updateField('sku', e.target.value)} placeholder="SKU" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" value={form.price} onChange={e => updateField('price', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price ($)</Label>
                <Input id="discountPrice" type="number" step="0.01" value={form.discountPrice} onChange={e => updateField('discountPrice', e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={v => updateField('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" value={form.stock} onChange={e => updateField('stock', e.target.value)} placeholder="0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={img}
                    onChange={e => updateImage(index, e.target.value)}
                    placeholder="Image URL"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(index)} disabled={form.images.length <= 1}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <Plus className="h-4 w-4 mr-2" /> Add Image
              </Button>

              <div className="space-y-2 pt-4">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input id="featuredImage" value={form.featuredImage} onChange={e => updateField('featuredImage', e.target.value)} placeholder="Featured image URL" />
                {form.images.filter(i => i.trim()).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.filter(i => i.trim()).map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateField('featuredImage', img)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${form.featuredImage === img ? 'border-primary ring-2 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colors">Colors (comma separated)</Label>
                <Input id="colors" value={form.colors} onChange={e => updateField('colors', e.target.value)} placeholder="Red, Blue, Black" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizes">Sizes (comma separated)</Label>
                <Input id="sizes" value={form.sizes} onChange={e => updateField('sizes', e.target.value)} placeholder="S, M, L, XL" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch id="featured" checked={form.featured} onCheckedChange={v => updateField('featured', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bestSeller">Best Seller</Label>
                <Switch id="bestSeller" checked={form.bestSeller} onCheckedChange={v => updateField('bestSeller', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newArrival">New Arrival</Label>
                <Switch id="newArrival" checked={form.newArrival} onCheckedChange={v => updateField('newArrival', v)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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
