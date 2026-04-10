import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentItem {
  id: string;
  name: string;
  location: string;
  category?: string;
  createdAt: string | Date;
}

interface RecentItemsProps {
  items: RecentItem[];
  isLoading?: boolean;
}

export function RecentItems({ items, isLoading = false }: RecentItemsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Items</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                No items yet
              </p>
              <p className="text-xs text-muted-foreground">
                Create your first item to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.category && <Badge variant="secondary">{item.category}</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
