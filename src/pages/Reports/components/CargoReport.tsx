
import { Cargo, CargoStatus, CargoType } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/chart';

interface CargoReportProps {
  cargo: Cargo[];
}

export function CargoReport({ cargo }: CargoReportProps) {
  // Calculate cargo type distribution
  const typeData = Object.values(CargoType).reduce((acc, type) => {
    const count = cargo.filter(item => item.type === type).length;
    if (count > 0) {
      acc.push({ name: type, value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate cargo status distribution
  const statusData = Object.values(CargoStatus).reduce((acc, status) => {
    const count = cargo.filter(item => item.status === status).length;
    if (count > 0) {
      acc.push({ name: status.replace('-', ' '), value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate cargo weight by destination
  const destinationData = cargo.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.destination);
    if (existing) {
      existing.value += item.weight;
    } else {
      acc.push({ name: item.destination, value: item.weight });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Colors for charts
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cargo by Type</CardTitle>
            <CardDescription>Distribution of cargo by type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={typeData}
              dataKey="value"
              nameKey="name"
              colors={colors}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cargo by Status</CardTitle>
            <CardDescription>Distribution of cargo by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={statusData}
              dataKey="value"
              nameKey="name"
              colors={colors}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cargo Weight by Destination</CardTitle>
          <CardDescription>Total weight of cargo per destination (kg)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart
            data={destinationData}
            keys={['value']}
            indexBy="name"
            colors={['#8884d8']}
          />
        </CardContent>
      </Card>
    </div>
  );
}
