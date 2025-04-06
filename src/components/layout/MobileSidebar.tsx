
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Home,
  Package,
  Users,
  Grid,
  Calendar,
  BarChart3,
  Settings,
  Activity,
  ShieldAlert,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Cargo',
    href: '/cargo',
    icon: Package,
  },
  {
    title: 'Astronauts',
    href: '/astronauts',
    icon: Users,
  },
  {
    title: 'Modules',
    href: '/modules',
    icon: Grid,
  },
  {
    title: 'Missions',
    href: '/missions',
    icon: Calendar,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: Activity,
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: ShieldAlert,
    roles: ['admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function MobileSidebar() {
  const { pathname } = useLocation();
  const { role, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="fixed bottom-4 right-4 md:hidden z-40">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80%] p-0 flex flex-col">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-space-accent opacity-90 shadow-lg shadow-space-accent/20 flex items-center justify-center">
                <div className="size-6 rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
              <span className="text-lg font-bold text-primary">STELLAR CARGO</span>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navItems
                .filter(item => !item.roles || item.roles.includes(role || ''))
                .map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-3 text-sm font-medium hover:bg-secondary",
                      pathname === item.href ? "bg-secondary text-primary" : "transparent"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.title}</span>
                    {item.href === '/cargo' && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-space-accent text-white text-xs">5</span>
                    )}
                  </Link>
                ))}
            </div>
          </div>
          
          <div className="border-t py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground">
                  System Status:
                </p>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-space-success animate-pulse"></div>
                  <span className="ml-2 text-xs font-medium">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
