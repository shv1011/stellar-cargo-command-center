
import { Astronaut, AstronautStatus } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/chart';

interface AstronautReportProps {
  astronauts: Astronaut[];
}

export function AstronautReport({ astronauts }: AstronautReportProps) {
  // Calculate astronaut status distribution
  const statusData = Object.values(AstronautStatus).reduce((acc, status) => {
    const count = astronauts.filter(item => item.status === status).length;
    if (count > 0) {
      acc.push({ name: status.replace('-', ' '), value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate astronaut specialties
  const specialtyData = astronauts.reduce((acc, astronaut) => {
    const existing = acc.find(s => s.name === astronaut.specialty);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: astronaut.specialty, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate mission experience
  const experienceData = astronauts.map(astronaut => ({
    name: astronaut.name,
    missions: astronaut.missionCount
  })).sort((a, b) => b.missions - a.missions).slice(0, 10);

  // Colors for charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Astronaut Status</CardTitle>
            <CardDescription>Distribution by current status</CardDescription>
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
            <CardTitle>Astronaut Specialties</CardTitle>
            <CardDescription>Distribution by specialization</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={specialtyData}
              dataKey="value"
              nameKey="name"
              colors={colors}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mission Experience</CardTitle>
          <CardDescription>Top 10 astronauts by mission count</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart
            data={experienceData}
            keys={['missions']}
            indexBy="name"
            colors={['#8884d8']}
          />
        </CardContent>
      </Card>
    </div>
  );
}
