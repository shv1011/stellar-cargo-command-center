
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Module } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
import { ModuleForm } from './ModuleForm';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const { deleteModule } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-amber-500';
      case 'docking':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCapacityPercentage = () => {
    return Math.round((module.usedCapacity / module.capacity) * 100);
  };

  const handleDelete = () => {
    deleteModule(module.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{module.name}</CardTitle>
            <Badge
              className={`${getStatusColor(module.status)} text-white shadow-sm`}
              variant="outline"
            >
              {module.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="text-muted-foreground text-sm">{module.location}</div>
            
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Capacity Usage</span>
                <span className="font-medium">{getCapacityPercentage()}%</span>
              </div>
              <Progress value={getCapacityPercentage()} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Capacity</div>
                <div className="font-medium">{module.capacity} m³</div>
              </div>
              <div>
                <div className="text-muted-foreground">Used Capacity</div>
                <div className="font-medium">{module.usedCapacity} m³</div>
              </div>
              <div>
                <div className="text-muted-foreground">Astronauts</div>
                <div className="font-medium">{module.astronautCount}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Cargo Items</div>
                <div className="font-medium">{module.cargoCount}</div>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="text-muted-foreground">Last Maintenance</div>
              <div className="font-medium">{format(new Date(module.lastMaintenance), 'PPP')}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
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
        </CardFooter>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
          </DialogHeader>
          <ModuleForm module={module} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {module.name}? This action cannot be undone.
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
