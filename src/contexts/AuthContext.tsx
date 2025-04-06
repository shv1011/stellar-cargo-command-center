
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, User, UserRole } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem('spaceCargoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with a small delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would verify credentials with a backend
    // Here we're just checking if the email exists in our mock data
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'spacehack') { // Simple password check
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('spaceCargoUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('spaceCargoUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
