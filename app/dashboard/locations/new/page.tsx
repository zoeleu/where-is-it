'use client';

import { LocationForm } from '@/components/dashboard/location-form';

export default function DashboardNewLocationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Location</h1>
        <p className="text-muted-foreground">
          Add a new storage location to organize your items.
        </p>
      </div>

      <LocationForm />
    </div>
  );
}