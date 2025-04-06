
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/Auth/LoginPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { CargoPage } from "./pages/Cargo/CargoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public route component (can't access if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="cargo" element={<CargoPage />} />
        <Route path="astronauts" element={<div>Astronauts Page (Coming Soon)</div>} />
        <Route path="modules" element={<div>Modules Page (Coming Soon)</div>} />
        <Route path="missions" element={<div>Missions Page (Coming Soon)</div>} />
        <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
        <Route path="activity" element={<div>Activity Page (Coming Soon)</div>} />
        <Route path="admin" element={<div>Admin Page (Coming Soon)</div>} />
        <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
