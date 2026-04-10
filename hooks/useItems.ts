import { useCallback, useState } from "react";

export interface ItemLocation {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  userId: string;
  locationId: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  notes: string | null;
  imageUrl: string | null;
  location: ItemLocation;
  createdAt: string;
  updatedAt: string;
}

export async function fetchUserItems(): Promise<Item[]> {
  const response = await fetch("/api/items");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch items");
  }

  return response.json();
}

export async function fetchItemById(id: string): Promise<Item> {
  const response = await fetch(`/api/items/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch item");
  }

  return response.json();
}

export async function createItem(data: {
  name: string;
  description?: string | null;
  category?: string | null;
  quantity?: number;
  notes?: string | null;
  imageUrl?: string | null;
  locationId: string;
}): Promise<Item> {
  const response = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create item");
  }

  return response.json();
}

export async function updateItem(
  id: string,
  data: {
    name?: string;
    description?: string | null;
    category?: string | null;
    quantity?: number;
    notes?: string | null;
    imageUrl?: string | null;
    locationId?: string;
  }
): Promise<Item> {
  const response = await fetch(`/api/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update item");
  }

  return response.json();
}

export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete item");
  }
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserItems();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback((item: Item) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const updateItemInList = useCallback(
    (id: string, updates: Partial<Item>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  return {
    items,
    loading,
    error,
    loadItems,
    addItem,
    removeItem,
    updateItemInList,
  };
}