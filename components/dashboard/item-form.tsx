'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createItem, updateItem } from '@/hooks/useItems';

interface LocationOption {
  id: string;
  name: string;
}

interface ItemFormProps {
  item?: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    quantity: number;
    notes: string | null;
    imageUrl: string | null;
    locationId: string;
  };
  locations: LocationOption[];
  isSubmitting?: boolean;
}

interface ItemFormPayload {
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  notes: string | null;
  imageUrl: string | null;
  locationId: string;
}

export function ItemForm({ item, locations, isSubmitting = false }: ItemFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    quantity: item?.quantity?.toString() || '1',
    notes: item?.notes || '',
    imageUrl: item?.imageUrl || '',
    locationId: item?.locationId || locations[0]?.id || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!item;
  const shouldBlockForm = locations.length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (shouldBlockForm) {
      setError('Create a location before adding items.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: ItemFormPayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        quantity: Number(formData.quantity),
        notes: formData.notes.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
        locationId: formData.locationId,
      };

      if (!payload.name) {
        setError('Item name is required');
        setLoading(false);
        return;
      }

      if (!payload.locationId) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      if (!Number.isInteger(payload.quantity) || payload.quantity < 1) {
        setError('Quantity must be a positive whole number');
        setLoading(false);
        return;
      }

      const result = isEditMode
        ? await updateItem(item.id, payload)
        : await createItem(payload);

      router.push(`/dashboard/items/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (shouldBlockForm) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Item' : 'Create Item'}</h2>
            <p className="text-sm text-muted-foreground">
              You need at least one location before you can store items.
            </p>
          </div>
          <Button asChild>
            <a href="/dashboard/locations/new">Add a Location</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Item' : 'Create Item'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Winter coats, Camera, Extension cords"
              value={formData.name}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Location *</Label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm"
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                type="text"
                placeholder="e.g., Clothing, Tools, Electronics"
                value={formData.category}
                onChange={handleChange}
                disabled={loading || isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                disabled={loading || isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a short description for this item..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              className="w-full min-h-[100px] px-2.5 py-1 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any extra details, condition notes, or reminders..."
              value={formData.notes}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              className="w-full min-h-[100px] px-2.5 py-1 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={loading || isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isSubmitting}>
              {loading || isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}