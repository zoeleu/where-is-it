'use client';

import { useEffect, useState } from 'react';
import { ItemForm } from '@/components/dashboard/item-form';
import { fetchUserLocations } from '@/hooks/useLocations';

interface LocationOption {
  id: string;
  name: string;
}

export default function DashboardNewItemPage() {
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true);
        const data = await fetchUserLocations();
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load locations');
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Item</h1>
        <p className="text-muted-foreground">
          Add a new item and assign it to one of your locations.
        </p>
      </div>

      {loading ? (
        <div className="h-80 rounded-xl bg-muted animate-pulse" />
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <ItemForm locations={locations} />
      )}
    </div>
  );
}