
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Filter, Search } from 'lucide-react';
import { AstronautCard } from './AstronautCard';
import { AstronautForm } from './AstronautForm';
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
import { AstronautStatus } from '@/data/mockData';

export function AstronautsPage() {
  const { astronauts, searchQuery, setSearchQuery } = useData();
  const [statusFilter, setStatusFilter] = useState<AstronautStatus | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter astronauts based on search query and status filter
  const filteredAstronauts = astronauts.filter((astronaut) => {
    const matchesSearch = astronaut.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astronaut.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astronaut.rank.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || astronaut.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Astronauts | Space Cargo Management</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Astronauts</h1>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-space-accent">
            <UserPlus className="h-4 w-4" />
            Add Astronaut
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Astronaut Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search astronauts..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as AstronautStatus | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAstronauts.length > 0 ? (
            filteredAstronauts.map((astronaut) => (
              <AstronautCard key={astronaut.id} astronaut={astronaut} />
            ))
          ) : (
            <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div>
                <p className="text-lg font-medium">No astronauts found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Astronaut</DialogTitle>
          </DialogHeader>
          <AstronautForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AstronautsPage;
