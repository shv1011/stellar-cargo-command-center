
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Module, ModuleStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModuleFormProps {
  module?: Module;
  onClose: () => void;
}

export function ModuleForm({ module, onClose }: ModuleFormProps) {
  const { addModule, updateModule } = useData();
  
  const [formData, setFormData] = useState<Omit<Module, 'id'>>({
    name: module?.name || '',
    status: module?.status || 'active',
    capacity: module?.capacity || 100,
    usedCapacity: module?.usedCapacity || 0,
    location: module?.location || '',
    astronautCount: module?.astronautCount || 0,
    cargoCount: module?.cargoCount || 0,
    lastMaintenance: module?.lastMaintenance || new Date().toISOString(),
  });

  const handleChange = (field: keyof Omit<Module, 'id'>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (module) {
      updateModule(module.id, formData);
    } else {
      addModule(formData);
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value as ModuleStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="docking">Docking</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="capacity">Total Capacity (m³)</Label>
          <Input
            id="capacity"
            type="number"
            min="0"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="usedCapacity">Used Capacity (m³)</Label>
          <Input
            id="usedCapacity"
            type="number"
            min="0"
            max={formData.capacity}
            value={formData.usedCapacity}
            onChange={(e) => handleChange('usedCapacity', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="astronautCount">Astronaut Count</Label>
          <Input
            id="astronautCount"
            type="number"
            min="0"
            value={formData.astronautCount}
            onChange={(e) => handleChange('astronautCount', parseInt(e.target.value) || 0)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cargoCount">Cargo Count</Label>
          <Input
            id="cargoCount"
            type="number"
            min="0"
            value={formData.cargoCount}
            onChange={(e) => handleChange('cargoCount', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
        <Input
          id="lastMaintenance"
          type="date"
          value={new Date(formData.lastMaintenance).toISOString().split('T')[0]}
          onChange={(e) => handleChange('lastMaintenance', new Date(e.target.value).toISOString())}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-space-accent">
          {module ? 'Update Module' : 'Add Module'}
        </Button>
      </div>
    </form>
  );
}
