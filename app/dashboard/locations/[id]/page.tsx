'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, MoreHorizontal, Trash2, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteLocation, fetchLocationById, fetchUserLocations } from '@/hooks/useLocations';
import { deleteItem, updateItem } from '@/hooks/useItems';

interface LocationItem {
  id: string;
  name: string;
  quantity: number;
  category?: string;
}

interface Location {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  items: LocationItem[];
  createdAt: string;
}

interface LocationOption {
  id: string;
  name: string;
}

export default function DashboardLocationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [itemActionId, setItemActionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocation() {
      try {
        setLoading(true);
        const [locationData, locationList] = await Promise.all([
          fetchLocationById(id),
          fetchUserLocations(),
        ]);

        setLocation(locationData as Location);
        setLocations(locationList.filter((entry) => entry.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load location');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadLocation();
    }
  }, [id]);

  const refreshLocation = async () => {
    const data = await fetchLocationById(id);
    setLocation(data as Location);
  };

  const handleDeleteItem = async (item: LocationItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setItemActionId(item.id);
      await deleteItem(item.id);
      await refreshLocation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setItemActionId(null);
    }
  };

  const handleMoveItem = async (item: LocationItem, targetLocationId: string) => {
    try {
      setItemActionId(item.id);
      await updateItem(item.id, { locationId: targetLocationId });
      await refreshLocation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move item');
    } finally {
      setItemActionId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${location?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await deleteLocation(id);
      router.push('/dashboard/locations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">
                {error || 'Location not found'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{location.name}</h1>
            {location.description && (
              <p className="text-muted-foreground">{location.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/dashboard/locations/${location.id}/edit`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </a>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{location.itemCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date(location.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items in this Location</CardTitle>
        </CardHeader>
        <CardContent>
          {location.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No items in this location yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {location.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {item.category ? (
                          <Badge variant="outline">{item.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Manage ${item.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <MoveRight className="h-4 w-4" />
                                Move to
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {locations.length === 0 ? (
                                  <DropdownMenuItem disabled>
                                    No other locations
                                  </DropdownMenuItem>
                                ) : (
                                  locations.map((targetLocation) => (
                                    <DropdownMenuItem
                                      key={targetLocation.id}
                                      onClick={() => handleMoveItem(item, targetLocation.id)}
                                      disabled={itemActionId === item.id}
                                    >
                                      {targetLocation.name}
                                    </DropdownMenuItem>
                                  ))
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteItem(item)}
                              disabled={itemActionId === item.id}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}