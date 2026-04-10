'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentItems } from '@/components/dashboard/recent-items';
import { LocationGrid } from '@/components/dashboard/location-grid';
import { fetchUserLocations } from '@/hooks/useLocations';
import { fetchUserItems } from '@/hooks/useItems';

interface DashboardItem {
  id: string;
  name: string;
  category: string | null;
  createdAt: string;
  location: {
    name: string;
  };
}

interface DashboardLocation {
  id: string;
  name: string;
  itemCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalItems: 0,
    recentlyAdded: 0,
  });
  const [recentItems, setRecentItems] = useState<
    Array<{ id: string; name: string; location: string; category?: string; createdAt: string }>
  >([]);
  const [locations, setLocations] = useState<DashboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError('');

        const [locationData, itemData] = await Promise.all([
          fetchUserLocations(),
          fetchUserItems(),
        ]);

        const recentThreshold = Date.now() - 7 * 24 * 60 * 60 * 1000;

        setLocations(locationData);
        setStats({
          totalLocations: locationData.length,
          totalItems: itemData.length,
          recentlyAdded: itemData.filter(
            (item) => new Date(item.createdAt).getTime() >= recentThreshold
          ).length,
        });
        setRecentItems(
          itemData.slice(0, 5).map((item: DashboardItem) => ({
            id: item.id,
            name: item.name,
            location: item.location.name,
            category: item.category || undefined,
            createdAt: item.createdAt,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your storage.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/items/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/locations/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Locations"
          value={stats.totalLocations}
          description="Storage spaces"
        />
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          description="Items tracked"
        />
        <StatsCard
          title="Recently Added"
          value={stats.recentlyAdded}
          description="Last 7 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <RecentItems items={recentItems} isLoading={isLoading} />
      </div>

      <LocationGrid locations={locations} isLoading={isLoading} />
    </div>
  );
}
