
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Search } from 'lucide-react';
import { MissionCard } from './MissionCard';
import { MissionForm } from './MissionForm';
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
import { MissionStatus } from '@/data/mockData';

export function MissionsPage() {
  const { missions, searchQuery, setSearchQuery } = useData();
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter missions based on search query and status filter
  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Missions | Space Cargo Management</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Missions</h1>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-space-accent">
            <Calendar className="h-4 w-4" />
            Add Mission
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mission Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search missions..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as MissionStatus | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="aborted">Aborted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div>
                <p className="text-lg font-medium">No missions found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Mission</DialogTitle>
          </DialogHeader>
          <MissionForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MissionsPage;
