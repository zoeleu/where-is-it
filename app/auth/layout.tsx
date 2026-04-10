import Link from 'next/link';
import { Package } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Package className="h-6 w-6" />
            Where is it?
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
