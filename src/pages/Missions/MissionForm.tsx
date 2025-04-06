
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Mission, MissionStatus } from '@/data/mockData';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface MissionFormProps {
  mission?: Mission;
  onClose: () => void;
}

export function MissionForm({ mission, onClose }: MissionFormProps) {
  const { addMission, updateMission, astronauts, modules, cargo } = useData();
  
  const [formData, setFormData] = useState<Omit<Mission, 'id'>>({
    name: mission?.name || '',
    status: mission?.status || 'planned',
    startDate: mission?.startDate || new Date().toISOString(),
    endDate: mission?.endDate || undefined,
    description: mission?.description || '',
    moduleIds: mission?.moduleIds || [],
    astronautIds: mission?.astronautIds || [],
    cargoIds: mission?.cargoIds || [],
  });

  const handleChange = (field: keyof Omit<Mission, 'id'>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mission) {
      updateMission(mission.id, formData);
    } else {
      addMission(formData);
    }
    
    onClose();
  };

  const toggleAstronaut = (id: string) => {
    if (formData.astronautIds.includes(id)) {
      handleChange('astronautIds', formData.astronautIds.filter(item => item !== id));
    } else {
      handleChange('astronautIds', [...formData.astronautIds, id]);
    }
  };

  const toggleModule = (id: string) => {
    if (formData.moduleIds.includes(id)) {
      handleChange('moduleIds', formData.moduleIds.filter(item => item !== id));
    } else {
      handleChange('moduleIds', [...formData.moduleIds, id]);
    }
  };

  const toggleCargo = (id: string) => {
    if (formData.cargoIds.includes(id)) {
      handleChange('cargoIds', formData.cargoIds.filter(item => item !== id));
    } else {
      handleChange('cargoIds', [...formData.cargoIds, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Mission Name</Label>
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
            onValueChange={(value) => handleChange('status', value as MissionStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="aborted">Aborted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={new Date(formData.startDate).toISOString().split('T')[0]}
            onChange={(e) => handleChange('startDate', new Date(e.target.value).toISOString())}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              if (e.target.value) {
                handleChange('endDate', new Date(e.target.value).toISOString());
              } else {
                handleChange('endDate', undefined);
              }
            }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Assigned Astronauts</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {formData.astronautIds.length > 0
                ? `${formData.astronautIds.length} astronauts selected`
                : "Select astronauts"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search astronauts..." />
              <CommandEmpty>No astronauts found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {astronauts.map((astronaut) => (
                  <CommandItem
                    key={astronaut.id}
                    value={astronaut.id}
                    onSelect={() => toggleAstronaut(astronaut.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.astronautIds.includes(astronaut.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {astronaut.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Assigned Modules</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {formData.moduleIds.length > 0
                ? `${formData.moduleIds.length} modules selected`
                : "Select modules"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search modules..." />
              <CommandEmpty>No modules found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {modules.map((module) => (
                  <CommandItem
                    key={module.id}
                    value={module.id}
                    onSelect={() => toggleModule(module.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.moduleIds.includes(module.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {module.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Assigned Cargo</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {formData.cargoIds.length > 0
                ? `${formData.cargoIds.length} cargo items selected`
                : "Select cargo items"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search cargo..." />
              <CommandEmpty>No cargo found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {cargo.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => toggleCargo(item.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.cargoIds.includes(item.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-space-accent">
          {mission ? 'Update Mission' : 'Add Mission'}
        </Button>
      </div>
    </form>
  );
}
