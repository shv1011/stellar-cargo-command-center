
import { Mission, MissionStatus } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/chart';

interface MissionReportProps {
  missions: Mission[];
}

export function MissionReport({ missions }: MissionReportProps) {
  // Calculate mission status distribution
  const statusData = Object.values(MissionStatus).reduce((acc, status) => {
    const count = missions.filter(item => item.status === status).length;
    if (count > 0) {
      acc.push({ name: status.replace('-', ' '), value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

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
            <PieChart
              data={statusData}
              dataKey="value"
              nameKey="name"
              colors={colors}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Astronaut Assignments</CardTitle>
            <CardDescription>Number of astronauts per mission</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={astronautData}
              keys={['astronauts']}
              indexBy="name"
              colors={['#8884d8']}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Modules, cargo and crew by mission</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart
            data={resourceData}
            keys={['modules', 'cargo', 'crew']}
            indexBy="name"
            colors={colors}
            stacked={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
