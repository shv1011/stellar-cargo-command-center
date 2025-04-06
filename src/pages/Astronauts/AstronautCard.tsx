
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Astronaut } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
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
import { AstronautForm } from './AstronautForm';

interface AstronautCardProps {
  astronaut: Astronaut;
}

export function AstronautCard({ astronaut }: AstronautCardProps) {
  const { deleteAstronaut } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'in-transit':
        return 'bg-blue-500';
      case 'on-leave':
        return 'bg-amber-500';
      case 'training':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleDelete = () => {
    deleteAstronaut(astronaut.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-32 w-full bg-gradient-to-r from-space-accent/80 to-space-accent">
            <div className="absolute -bottom-10 left-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={astronaut.avatar} alt={astronaut.name} />
                <AvatarFallback className="text-lg">{getInitials(astronaut.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute right-2 top-2">
              <Badge
                className={`${getStatusColor(astronaut.status)} text-white shadow-sm`}
                variant="outline"
              >
                {astronaut.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-12">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg leading-none">{astronaut.name}</h3>
            <p className="text-muted-foreground">{astronaut.rank}</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Specialty:</span>
              <span className="font-medium">{astronaut.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Missions:</span>
              <span className="font-medium">{astronaut.missionCount}</span>
            </div>
            {astronaut.moduleId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Module:</span>
                <span className="font-medium">{astronaut.moduleId}</span>
              </div>
            )}
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
            <DialogTitle>Edit Astronaut</DialogTitle>
          </DialogHeader>
          <AstronautForm astronaut={astronaut} onClose={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Astronaut</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {astronaut.name}? This action cannot be undone.
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
