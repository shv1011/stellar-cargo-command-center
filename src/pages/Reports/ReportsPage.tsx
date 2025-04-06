
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, FileText, Download } from 'lucide-react';
import { CargoReport } from './components/CargoReport';
import { AstronautReport } from './components/AstronautReport';
import { ModuleReport } from './components/ModuleReport';
import { MissionReport } from './components/MissionReport';

export function ReportsPage() {
  const { cargo, modules, astronauts, missions } = useData();
  const [activeTab, setActiveTab] = useState('cargo');

  const exportReportData = () => {
    let data;
    let filename;

    // Get the appropriate data based on the active tab
    switch (activeTab) {
      case 'cargo':
        data = cargo;
        filename = 'cargo-report.json';
        break;
      case 'modules':
        data = modules;
        filename = 'modules-report.json';
        break;
      case 'astronauts':
        data = astronauts;
        filename = 'astronauts-report.json';
        break;
      case 'missions':
        data = missions;
        filename = 'missions-report.json';
        break;
      default:
        data = {};
        filename = 'report.json';
    }

    // Create a blob with the data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderReportCount = () => {
    const categories = [
      { name: 'Cargo', count: cargo.length, icon: BarChart },
      { name: 'Modules', count: modules.length, icon: PieChart },
      { name: 'Astronauts', count: astronauts.length, icon: LineChart },
      { name: 'Missions', count: missions.length, icon: FileText },
    ];

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.name} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name} Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{category.count}</div>
                <category.icon className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Reports | Space Cargo Management</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <Button onClick={exportReportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        {renderReportCount()}
        
        <Card>
          <CardHeader>
            <CardTitle>Detailed Reports</CardTitle>
            <CardDescription>
              View and analyze data across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="cargo">Cargo</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="astronauts">Astronauts</TabsTrigger>
                <TabsTrigger value="missions">Missions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cargo" className="space-y-4">
                <CargoReport cargo={cargo} />
              </TabsContent>
              
              <TabsContent value="modules" className="space-y-4">
                <ModuleReport modules={modules} />
              </TabsContent>
              
              <TabsContent value="astronauts" className="space-y-4">
                <AstronautReport astronauts={astronauts} />
              </TabsContent>
              
              <TabsContent value="missions" className="space-y-4">
                <MissionReport missions={missions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ReportsPage;
