
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Mission } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Trash2, Users, Package, Grid } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MissionForm } from './MissionForm';

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { deleteMission, astronauts, modules, cargo } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-green-500';
      case 'completed':
        return 'bg-purple-500';
      case 'aborted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const assignedAstronauts = astronauts.filter(a => mission.astronautIds.includes(a.id));
  const assignedModules = modules.filter(m => mission.moduleIds.includes(m.id));
  const assignedCargo = cargo.filter(c => mission.cargoIds.includes(c.id));

  const handleDelete = () => {
    deleteMission(mission.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{mission.name}</CardTitle>
            <Badge
              className={`${getStatusColor(mission.status)} text-white shadow-sm`}
              variant="outline"
            >
              {mission.status.replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <p className="text-muted-foreground">{mission.description}</p>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Start: {format(new Date(mission.startDate), 'PPP')}
                </span>
              </div>
              
              {mission.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    End: {format(new Date(mission.endDate), 'PPP')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {assignedAstronauts.length} Astronauts
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {assignedModules.length} Modules
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {assignedCargo.length} Cargo Items
                </span>
              </div>
            </div>

            {detailsExpanded && (
              <div className="space-y-4 mt-4 pt-4 border-t">
                {assignedAstronauts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assigned Astronauts</h4>
                    <div className="space-y-1">
                      {assignedAstronauts.map(astronaut => (
                        <div key={astronaut.id} className="text-sm">{astronaut.name}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {assignedModules.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assigned Modules</h4>
                    <div className="space-y-1">
                      {assignedModules.map(module => (
                        <div key={module.id} className="text-sm">{module.name}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {assignedCargo.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Cargo Items</h4>
                    <div className="space-y-1">
                      {assignedCargo.map(item => (
                        <div key={item.id} className="text-sm">{item.name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDetailsExpanded(!detailsExpanded)}
          >
            {detailsExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Mission</DialogTitle>
          </DialogHeader>
          <MissionForm mission={mission} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {mission.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
