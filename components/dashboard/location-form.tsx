'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationFormProps {
  location?: {
    id: string;
    name: string;
    description: string | null;
  };
  isSubmitting?: boolean;
}

export function LocationForm({ location, isSubmitting = false }: LocationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!location;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      };

      // Validate name
      if (!payload.name) {
        setError('Location name is required');
        setLoading(false);
        return;
      }

      const url = isEditMode
        ? `/api/locations/${location.id}`
        : '/api/locations';

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save location');
      }

      const result = await response.json();

      // Redirect to the location detail page or list page
      if (isEditMode) {
        router.push(`/dashboard/locations/${result.id}`);
      } else {
        router.push(`/dashboard/locations/${result.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Location' : 'Create Location'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Location Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Living Room, Garage, Storage Closet"
              value={formData.name}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Add notes about this location..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              className="w-full min-h-[100px] px-2.5 py-1 rounded-lg border border-input bg-transparent text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? 'Saving...' : 'Save Location'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
