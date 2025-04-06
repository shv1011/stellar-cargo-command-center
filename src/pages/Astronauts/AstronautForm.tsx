
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Astronaut, AstronautStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AstronautFormProps {
  astronaut?: Astronaut;
  onClose: () => void;
}

export function AstronautForm({ astronaut, onClose }: AstronautFormProps) {
  const { addAstronaut, updateAstronaut, modules } = useData();
  
  const [formData, setFormData] = useState<Omit<Astronaut, 'id'>>({
    name: astronaut?.name || '',
    rank: astronaut?.rank || '',
    specialty: astronaut?.specialty || '',
    status: astronaut?.status || 'active',
    moduleId: astronaut?.moduleId || undefined,
    missionCount: astronaut?.missionCount || 0,
    avatar: astronaut?.avatar || '/placeholder.svg',
    bio: astronaut?.bio || '',
  });

  const handleChange = (field: keyof Omit<Astronaut, 'id'>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (astronaut) {
      updateAstronaut(astronaut.id, formData);
    } else {
      addAstronaut(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rank">Rank</Label>
          <Input
            id="rank"
            value={formData.rank}
            onChange={(e) => handleChange('rank', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={formData.specialty}
            onChange={(e) => handleChange('specialty', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value as AstronautStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="moduleId">Module Assignment</Label>
          <Select
            value={formData.moduleId || ''}
            onValueChange={(value) => handleChange('moduleId', value || undefined)}
          >
            <SelectTrigger id="moduleId">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="missionCount">Mission Count</Label>
          <Input
            id="missionCount"
            type="number"
            min="0"
            value={formData.missionCount}
            onChange={(e) => handleChange('missionCount', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-space-accent">
          {astronaut ? 'Update Astronaut' : 'Add Astronaut'}
        </Button>
      </div>
    </form>
  );
}
