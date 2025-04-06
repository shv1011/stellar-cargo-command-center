
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Package, 
  Users, 
  Grid, 
  Calendar, 
  BarChart3, 
  Settings, 
  Activity, 
  ShieldAlert 
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

export function Sidebar() {
  const { pathname } = useLocation();
  const { role, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-sidebar md:flex">
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            {navItems
              .filter(item => !item.roles || item.roles.includes(role || ''))
              .map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "transparent"
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
      </div>
      <div className="mt-auto border-t py-4">
        <div className="px-7 py-2">
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
      </div>
    </aside>
  );
}
