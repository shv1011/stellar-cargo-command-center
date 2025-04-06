
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Grid, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { mockStats } from '@/data/mockData';

// Chart data
const cargoActivityData = [
  { name: "Jan", incoming: 20, outgoing: 15 },
  { name: "Feb", incoming: 25, outgoing: 22 },
  { name: "Mar", incoming: 18, outgoing: 20 },
  { name: "Apr", incoming: 30, outgoing: 25 },
  { name: "May", incoming: 40, outgoing: 30 },
  { name: "Jun", incoming: 35, outgoing: 38 },
];

export function DashboardPage() {
  const { cargo, modules, astronauts, missions, activityLogs } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(mockStats);
  
  useEffect(() => {
    // Update stats based on actual data
    setStats({
      ...mockStats,
      totalCargo: cargo.length,
      activeAstronauts: astronauts.filter(a => a.status === 'active').length,
      availableModules: modules.filter(m => m.status !== 'offline').length,
      activeModules: modules.filter(m => m.status === 'active').length,
      upcomingMissions: missions.filter(m => m.status === 'planned').length,
      activeMissions: missions.filter(m => m.status === 'in-progress').length,
    });
  }, [cargo, modules, astronauts, missions]);
  
  // Get module capacity percentage
  const getModuleCapacityPercentage = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 0;
    return Math.round((module.usedCapacity / module.capacity) * 100);
  };
  
  // Get module status color
  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-space-success';
      case 'maintenance': return 'bg-space-warning';
      case 'docking': return 'bg-blue-500';
      case 'offline': return 'bg-space-danger';
      default: return 'bg-space-gray';
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h2>
          <p className="text-muted-foreground">
            Here's an overview of the space cargo operations
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button 
            onClick={() => navigate('/cargo')}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Manage Cargo</span>
            <span className="absolute inset-0 bg-primary/80 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-200"></span>
          </Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cargo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCargo}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-space-success" />
              <span className="text-space-success">+5%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Progress value={65} className="h-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Astronauts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAstronauts}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowDown className="mr-1 h-3 w-3 text-space-danger" />
              <span className="text-space-danger">-2%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Progress value={75} className="h-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Modules</CardTitle>
            <Grid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableModules}/{modules.length}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>
                {stats.activeModules} Active, {modules.filter(m => m.status === 'maintenance').length} in Maintenance
              </span>
            </div>
            <div className="mt-3">
              <Progress value={stats.availableModules / modules.length * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Missions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMissions}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{stats.upcomingMissions} upcoming mission{stats.upcomingMissions !== 1 ? 's' : ''}</span>
            </div>
            <div className="mt-3">
              <Progress value={stats.activeMissions / (stats.activeMissions + stats.upcomingMissions) * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Cargo Activity Chart */}
        <Card className="bg-card/50 backdrop-blur-sm lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle>Cargo Movement</CardTitle>
            <CardDescription>Monthly cargo traffic in and out of the station</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cargoActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Bar 
                  dataKey="incoming" 
                  name="Incoming" 
                  fill="rgba(0, 197, 255, 0.8)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="outgoing" 
                  name="Outgoing" 
                  fill="rgba(255, 152, 0, 0.8)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Module Status */}
        <Card className="bg-card/50 backdrop-blur-sm lg:col-span-3 card-glow">
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
            <CardDescription>Current modules and their capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.slice(0, 4).map((module) => (
                <div key={module.id} className="flex items-center">
                  <div className={`size-3 rounded-full ${getModuleStatusColor(module.status)} mr-3`}></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{module.name}</p>
                      <span className="text-xs text-muted-foreground">{getModuleCapacityPercentage(module.id)}% full</span>
                    </div>
                    <Progress value={getModuleCapacityPercentage(module.id)} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/modules')}>
              View all modules
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recent Activities */}
        <Card className="bg-card/50 backdrop-blur-sm lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{log.action}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/activity')}>
              View all activity
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Mission Status */}
        <Card className="bg-card/50 backdrop-blur-sm lg:col-span-3 card-glow">
          <CardHeader>
            <CardTitle>Mission Status</CardTitle>
            <CardDescription>Ongoing and upcoming missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions.map((mission) => {
                let icon;
                let statusClass;
                
                switch(mission.status) {
                  case 'in-progress':
                    icon = <Clock className="h-4 w-4 text-blue-400" />;
                    statusClass = 'bg-blue-500/20 text-blue-400';
                    break;
                  case 'planned':
                    icon = <Calendar className="h-4 w-4 text-space-warning" />;
                    statusClass = 'bg-space-warning/20 text-space-warning';
                    break;
                  case 'completed':
                    icon = <CheckCircle2 className="h-4 w-4 text-space-success" />;
                    statusClass = 'bg-space-success/20 text-space-success';
                    break;
                  case 'aborted':
                    icon = <AlertTriangle className="h-4 w-4 text-space-danger" />;
                    statusClass = 'bg-space-danger/20 text-space-danger';
                    break;
                }
                
                return (
                  <div key={mission.id} className="flex items-start">
                    <div className="mr-3 mt-0.5">{icon}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{mission.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                          {mission.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(mission.startDate).toLocaleDateString()}
                        {mission.endDate ? ` - ${new Date(mission.endDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/missions')}>
              View all missions
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
