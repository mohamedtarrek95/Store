'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsForm {
  storeName: string;
  logo: string;
  contactEmail: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  shippingCost: string;
  taxRate: string;
  currency: string;
  banner: string;
  bannerText: string;
}

const emptyForm: SettingsForm = {
  storeName: 'Luxe Accessories',
  logo: '',
  contactEmail: '',
  phone: '',
  address: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  shippingCost: '0',
  taxRate: '0',
  currency: 'USD',
  banner: '',
  bannerText: '',
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setForm({
          storeName: data.storeName || '',
          logo: data.logo || '',
          contactEmail: data.contactEmail || '',
          phone: data.phone || '',
          address: data.address || '',
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          twitter: data.socialLinks?.twitter || '',
          youtube: data.socialLinks?.youtube || '',
          shippingCost: String(data.shippingCost || '0'),
          taxRate: String(data.taxRate || '0'),
          currency: data.currency || 'USD',
          banner: data.banner || '',
          bannerText: data.bannerText || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof SettingsForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const payload = {
        ...form,
        shippingCost: parseFloat(form.shippingCost) || 0,
        taxRate: parseFloat(form.taxRate) || 0,
        facebook: form.facebook,
        instagram: form.instagram,
        twitter: form.twitter,
        youtube: form.youtube,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      setToast({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save Settings</>
          )}
        </Button>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg text-sm ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400'
            : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" value={form.storeName} onChange={e => updateField('storeName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" value={form.logo} onChange={e => updateField('logo', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={form.address} onChange={e => updateField('address', e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" value={form.facebook} onChange={e => updateField('facebook', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" value={form.instagram} onChange={e => updateField('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitter" value={form.twitter} onChange={e => updateField('twitter', e.target.value)} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input id="youtube" value={form.youtube} onChange={e => updateField('youtube', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping & Tax</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
              <Input id="shippingCost" type="number" step="0.01" value={form.shippingCost} onChange={e => updateField('shippingCost', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" step="0.1" value={form.taxRate} onChange={e => updateField('taxRate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={e => updateField('currency', e.target.value)} placeholder="USD" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image URL</Label>
              <Input id="banner" value={form.banner} onChange={e => updateField('banner', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerText">Banner Text</Label>
              <Input id="bannerText" value={form.bannerText} onChange={e => updateField('bannerText', e.target.value)} placeholder="Summer Sale - 20% Off" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
