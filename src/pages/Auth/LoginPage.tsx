
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo accounts for easy login
  const demoAccounts = [
    { email: 'john@spacehack.com', role: 'Admin' },
    { email: 'sarah@spacehack.com', role: 'Astronaut' },
    { email: 'mike@spacehack.com', role: 'Staff' }
  ];
  
  const loginAsDemo = async (email: string) => {
    setEmail(email);
    setPassword('spacehack');
    
    setIsLoading(true);
    try {
      const success = await login(email, 'spacehack');
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-space-dark-blue opacity-90"></div>
        <div className="absolute size-[1000px] rounded-full bg-space-accent/5 blur-3xl -top-[400px] -right-[400px]"></div>
        <div className="absolute size-[800px] rounded-full bg-space-accent/10 blur-3xl -bottom-[300px] -left-[300px]"></div>
      </div>
      
      <div className="relative mx-auto flex w-full flex-col space-y-6 sm:w-[350px] md:w-[500px]">
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <div className="size-16 rounded-full bg-space-accent opacity-90 shadow-lg shadow-space-accent/20 flex items-center justify-center">
            <div className="size-10 rounded-full bg-white/10 backdrop-blur-sm"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white mt-4">
            STELLAR CARGO
          </h1>
          <p className="text-space-gray">
            Space Cargo Management System
          </p>
        </div>
        
        <Card className="bg-card/80 backdrop-blur-sm border-space-light-blue/20 shadow-xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>
              
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      type="button"
                      onClick={() => loginAsDemo(account.email)}
                      disabled={isLoading}
                      className="text-xs h-8"
                    >
                      Login as {account.role} ({account.email})
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          National Space Hackathon &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
