'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/providers/CartProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchBar } from '@/components/products/SearchBar';
import {
  ShoppingBag, Heart, User, Menu, X, Search, LayoutDashboard,
  Package, ShoppingCart, Users, Tag, Settings, LogOut, Shield,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/products?category=watches', label: 'Watches' },
  { href: '/products?category=bracelets', label: 'Bracelets' },
  { href: '/products?category=necklaces', label: 'Necklaces' },
];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = getItemCount();
  const isAdmin = (session?.user as any)?.isAdmin === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col gap-1 p-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <div className="my-2 h-px bg-border" />
                    <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
                {!session && (
                  <div className="mt-4 flex flex-col gap-2 px-3">
                    <Button asChild variant="default" size="sm">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">LUXE</span>
            <span className="hidden text-sm text-muted-foreground sm:inline-block">Accessories</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-1">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">{session.user?.name || 'User'}</div>
                <p className="px-2 pb-1.5 text-xs text-muted-foreground">{session.user?.email}</p>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="cursor-pointer">Wishlist</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">Admin</div>
                    {adminLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center gap-2 cursor-pointer">
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex md:items-center md:gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t px-4 py-3">
          <div className="container mx-auto">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
