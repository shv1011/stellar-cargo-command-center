
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const { setSearchQuery } = useData();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  if (!isAuthenticated) return null;
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-space-accent opacity-90 shadow-lg shadow-space-accent/20 flex items-center justify-center">
            <div className="size-6 rounded-full bg-white/10 backdrop-blur-sm"></div>
          </div>
          <span className="text-lg font-bold text-primary hidden md:block">STELLAR CARGO</span>
        </Link>
      </div>
      
      <form onSubmit={handleSearch} className="flex-1 mx-4 md:mx-8 max-w-lg hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search cargo, astronauts, modules..."
            className="w-full bg-secondary/50 rounded-md border-0 pl-9 py-2 text-sm ring-1 ring-inset ring-space-dark-blue/5 focus:ring-space-accent"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </form>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-space-warning opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-space-warning"></span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="grid gap-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="font-medium text-sm">Notifications</h4>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <div className="grid gap-2">
                <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-secondary">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SYS</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Alert</p>
                    <p className="text-xs text-muted-foreground">Module Tranquility is now docking.</p>
                    <p className="text-xs text-muted-foreground mt-1">15 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-secondary">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>EC</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cargo Alert</p>
                    <p className="text-xs text-muted-foreground">Water supply is at 75% capacity.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-2">
                <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
                  View all notifications
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 rounded-lg p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="border-t"></div>
              <Button variant="ghost" size="sm" className="justify-start text-sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="justify-start text-sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
