
import { Mission, MissionStatus } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface MissionReportProps {
  missions: Mission[];
}

export function MissionReport({ missions }: MissionReportProps) {
  // Calculate mission status distribution
  const statusData = Object.values(MissionStatus).reduce((acc: { name: string; value: number }[], status) => {
    const count = missions.filter(item => item.status === status).length;
    if (count > 0) {
      acc.push({ name: status.replace('-', ' '), value: count });
    }
    return acc;
  }, []);

  // Calculate astronaut assignment counts
  const astronautData = missions.map(mission => ({
    name: mission.name,
    astronauts: mission.astronautIds.length
  }));

  // Calculate resource allocation
  const resourceData = missions.map(mission => ({
    name: mission.name.length > 15 ? mission.name.substring(0, 15) + '...' : mission.name,
    modules: mission.moduleIds.length,
    cargo: mission.cargoIds.length,
    crew: mission.astronautIds.length
  }));

  // Colors for charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mission Status</CardTitle>
            <CardDescription>Distribution of missions by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              className="h-full w-full" 
              config={{
                status1: { color: colors[0] },
                status2: { color: colors[1] },
                status3: { color: colors[2] },
                status4: { color: colors[3] }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Astronaut Assignments</CardTitle>
            <CardDescription>Number of astronauts per mission</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              className="h-full w-full" 
              config={{
                astronauts: { color: colors[0] }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={astronautData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="astronauts" fill={colors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Modules, cargo and crew by mission</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            className="h-full w-full" 
            config={{
              modules: { color: colors[0] },
              cargo: { color: colors[1] },
              crew: { color: colors[2] }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="modules" stackId="a" fill={colors[0]} />
                <Bar dataKey="cargo" stackId="a" fill={colors[1]} />
                <Bar dataKey="crew" stackId="a" fill={colors[2]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
