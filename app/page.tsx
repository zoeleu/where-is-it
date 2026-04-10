import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <Package className="h-6 w-6" />
            Where is it?
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl">
            Never lose track of your belongings again
          </h1>
          <p className="text-xl text-muted-foreground">
            Organize your storage spaces, catalog your items, and find anything
            in seconds. Where is it? helps you keep track of all your stuff.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-3">
            <div className="space-y-2">
              <MapPin className="mx-auto h-8 w-8 text-primary" />
              <h3 className="font-semibold">Manage Locations</h3>
              <p className="text-sm text-muted-foreground">
                Create and organize your storage spaces
              </p>
            </div>
            <div className="space-y-2">
              <Package className="mx-auto h-8 w-8 text-primary" />
              <h3 className="font-semibold">Track Items</h3>
              <p className="text-sm text-muted-foreground">
                Catalog everything you store with details
              </p>
            </div>
            <div className="space-y-2">
              <Search className="mx-auto h-8 w-8 text-primary" />
              <h3 className="font-semibold">Find Instantly</h3>
              <p className="text-sm text-muted-foreground">
                Search and locate items in seconds
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 Where is it? All rights reserved.</p>
      </footer>
    </div>
  );
}
