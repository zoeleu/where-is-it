'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemForm } from '@/components/dashboard/item-form';
import { fetchItemById } from '@/hooks/useItems';
import { fetchUserLocations } from '@/hooks/useLocations';

interface LocationOption {
  id: string;
  name: string;
}

interface ItemFormData {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  notes: string | null;
  imageUrl: string | null;
  locationId: string;
}

export default function DashboardEditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<ItemFormData | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [itemData, locationData] = await Promise.all([
          fetchItemById(id),
          fetchUserLocations(),
        ]);

        setItem({
          id: itemData.id,
          name: itemData.name,
          description: itemData.description,
          category: itemData.category,
          quantity: itemData.quantity,
          notes: itemData.notes,
          imageUrl: itemData.imageUrl,
          locationId: itemData.locationId,
        });
        setLocations(locationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="h-40 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error || 'Item not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
      </div>

      <ItemForm item={item} locations={locations} />
    </div>
  );
}