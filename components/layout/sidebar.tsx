'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Locations', href: '/dashboard/locations', icon: MapPin },
  { name: 'Items', href: '/dashboard/items', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const response = await signOut();

    if (!response.error) {
      router.push('/auth/login');
      router.refresh();
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex items-center gap-2 border-b p-4">
        <Package className="h-6 w-6" />
        <span className="font-semibold">Where is it?</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          // Check if pathname matches or is a sub-path of the nav item
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
