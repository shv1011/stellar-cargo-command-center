
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <MobileSidebar />
        
        <main className={`flex-1 ${isAuthenticated ? 'md:pl-64' : ''}`}>
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
