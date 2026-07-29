'use client';

import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Menu, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';

export default function AdminHeader() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="relative hidden md:flex items-center flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50" />
      </div>

      <div className="flex-1 md:flex-none" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="text-muted-foreground hover:text-foreground"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          3
        </span>
      </Button>

      <div className="flex items-center gap-3 pl-2 border-l">
        <div className="text-right text-sm hidden sm:block">
          <p className="font-medium leading-tight">{session?.user?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
