import { useCallback, useState } from 'react';

export interface Location {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationWithItems extends Location {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    category?: string;
  }>;
}

// Fetch all locations for the current user
export async function fetchUserLocations(): Promise<Location[]> {
  const response = await fetch('/api/locations');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch locations');
  }

  return response.json();
}

// Fetch a single location by ID
export async function fetchLocationById(id: string): Promise<LocationWithItems> {
  const response = await fetch(`/api/locations/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch location');
  }

  return response.json();
}

// Create a new location
export async function createLocation(data: {
  name: string;
  description?: string;
}): Promise<Location> {
  const response = await fetch('/api/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create location');
  }

  return response.json();
}

// Update a location
export async function updateLocation(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
): Promise<Location> {
  const response = await fetch(`/api/locations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update location');
  }

  return response.json();
}

// Delete a location
export async function deleteLocation(id: string): Promise<void> {
  const response = await fetch(`/api/locations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete location');
  }
}

// Custom hook for managing locations with state
export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserLocations();
      setLocations(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  }, []);

  const addLocation = useCallback((location: Location) => {
    setLocations((prev) => [location, ...prev]);
  }, []);

  const updateLocationInList = useCallback((id: string, updates: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, ...updates } : loc
      )
    );
  }, []);

  return {
    locations,
    loading,
    error,
    loadLocations,
    addLocation,
    removeLocation,
    updateLocationInList,
  };
}
