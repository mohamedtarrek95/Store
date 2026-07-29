'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ChevronDown,
  User,
  Heart,
  ShoppingBag,
  Package,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/products?category=new-arrivals', label: 'New Arrivals' },
  { href: '/products?category=best-sellers', label: 'Best Sellers' },
  { href: '/products?category=sale', label: 'Sale' },
];

const categoryLinks = [
  { href: '/products?category=necklaces', label: 'Necklaces' },
  { href: '/products?category=earrings', label: 'Earrings' },
  { href: '/products?category=bracelets', label: 'Bracelets' },
  { href: '/products?category=rings', label: 'Rings' },
  { href: '/products?category=watches', label: 'Watches' },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showCategories, setShowCategories] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <Link
              href="/"
              onClick={handleClose}
              className="text-xl font-bold tracking-tight"
            >
              LUXE
            </Link>
            <button
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClose}
                  className={cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-2">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                Categories
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showCategories && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l pl-3">
                      {categoryLinks.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={handleClose}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              <Link
                href="/wishlist"
                onClick={handleClose}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                <Heart className="h-4 w-4 mr-3" />
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={handleClose}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-3" />
                Cart
              </Link>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              {session?.user ? (
                <>
                  <div className="px-3 py-2 mb-2">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={handleClose}
                    className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Orders
                  </Link>
                  <button
                    onClick={() => { signOut(); handleClose(); }}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={handleClose}
                  className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Sign In
                </Link>
              )}
            </div>
          </nav>

          <div className="border-t p-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
