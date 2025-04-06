
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Grid, Filter, Search } from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { ModuleForm } from './ModuleForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ModulesPage() {
  const { modules, moduleStatusFilter, setModuleStatusFilter, searchQuery, setSearchQuery } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter modules based on search query and status filter
  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = moduleStatusFilter === 'all' || module.status === moduleStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Modules | Space Cargo Management</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-space-accent">
            <Grid className="h-4 w-4" />
            Add Module
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Module Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search modules..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={moduleStatusFilter}
                  onValueChange={setModuleStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="docking">Docking</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))
          ) : (
            <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div>
                <p className="text-lg font-medium">No modules found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Module</DialogTitle>
          </DialogHeader>
          <ModuleForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModulesPage;
