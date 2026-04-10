'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationGrid } from '@/components/dashboard/location-grid';
import { useLocations } from '@/hooks/useLocations';

export default function DashboardLocationsPage() {
  const { locations, loading, error, loadLocations } = useLocations();

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Manage your storage locations.
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard/locations/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </a>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <LocationGrid locations={locations} isLoading={loading} />
    </div>
  );
}