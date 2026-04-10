import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: string;
  name: string;
  itemCount: number;
}

interface LocationGridProps {
  locations: Location[];
  isLoading?: boolean;
}

export function LocationGrid({ locations, isLoading = false }: LocationGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Locations</h2>
        <Link
          href="/dashboard/locations/new"
          className="text-sm text-primary hover:underline"
        >
          Add Location
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No locations yet
              </p>
              <p className="text-xs text-muted-foreground">
                Create your first storage location to get started
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link key={location.id} href={`/dashboard/locations/${location.id}`}>
              <Card className="cursor-pointer hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Items</span>
                    <Badge>{location.itemCount}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
