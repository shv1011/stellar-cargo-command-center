
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cargo, CargoStatus, CargoType } from '@/data/mockData';

interface CargoFormProps {
  cargo?: Cargo;
  onClose: () => void;
}

export function CargoForm({ cargo, onClose }: CargoFormProps) {
  const { addCargo, updateCargo, modules, astronauts } = useData();
  
  const [name, setName] = useState(cargo?.name || '');
  const [type, setType] = useState<CargoType>(cargo?.type || 'equipment');
  const [weight, setWeight] = useState(cargo?.weight.toString() || '');
  const [volume, setVolume] = useState(cargo?.volume.toString() || '');
  const [status, setStatus] = useState<CargoStatus>(cargo?.status || 'pending');
  const [moduleId, setModuleId] = useState(cargo?.moduleId || '');
  const [destination, setDestination] = useState(cargo?.destination || '');
  const [assignedTo, setAssignedTo] = useState(cargo?.assignedTo || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cargoData = {
      name,
      type,
      weight: parseFloat(weight),
      volume: parseFloat(volume),
      status,
      moduleId: moduleId || undefined,
      destination,
      assignedTo: assignedTo || undefined,
    };
    
    if (cargo) {
      // Update existing cargo
      updateCargo(cargo.id, cargoData);
    } else {
      // Add new cargo
      addCargo(cargoData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cargo Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Water Supply"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Cargo Type</Label>
            <Select value={type} onValueChange={(value: CargoType) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="experiment">Experiment</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="100"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (m³)</Label>
            <Input
              id="volume"
              type="number"
              min="0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0.5"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: CargoStatus) => setStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loaded">Loaded</SelectItem>
                <SelectItem value="unloaded">Unloaded</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="ISS"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select 
              value={moduleId} 
              onValueChange={setModuleId}
            >
              <SelectTrigger id="module">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.name} - {module.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned Astronaut</Label>
            <Select 
              value={assignedTo} 
              onValueChange={setAssignedTo}
            >
              <SelectTrigger id="assignedTo">
                <SelectValue placeholder="Select astronaut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {astronauts.map((astronaut) => (
                  <SelectItem key={astronaut.id} value={astronaut.id}>
                    {astronaut.name} - {astronaut.rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {cargo ? 'Update Cargo' : 'Add Cargo'}
        </Button>
      </DialogFooter>
    </form>
  );
}
