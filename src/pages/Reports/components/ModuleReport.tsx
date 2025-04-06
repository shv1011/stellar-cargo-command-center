
import { Module, ModuleStatus } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/chart';

interface ModuleReportProps {
  modules: Module[];
}

export function ModuleReport({ modules }: ModuleReportProps) {
  // Calculate module status distribution
  const statusData = Object.values(ModuleStatus).reduce((acc, status) => {
    const count = modules.filter(item => item.status === status).length;
    if (count > 0) {
      acc.push({ name: status, value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate capacity usage by module
  const capacityData = modules.map(module => ({
    name: module.name,
    capacity: module.capacity,
    used: module.usedCapacity,
    available: module.capacity - module.usedCapacity
  }));

  // Calculate astronaut and cargo distribution by module
  const distData = modules.map(module => ({
    name: module.name,
    astronauts: module.astronautCount,
    cargo: module.cargoCount
  }));

  // Colors for charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
            <CardDescription>Distribution of modules by status</CardDescription>
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
            <CardTitle>Module Capacity Usage</CardTitle>
            <CardDescription>Capacity and usage by module (m³)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={capacityData}
              keys={['used', 'available']}
              indexBy="name"
              colors={['#ff8042', '#82ca9d']}
              stacked={true}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Astronauts and Cargo by Module</CardTitle>
          <CardDescription>Distribution of astronauts and cargo items</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart
            data={distData}
            keys={['astronauts', 'cargo']}
            indexBy="name"
            colors={['#8884d8', '#ffc658']}
            grouped={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
