
import { useState, useEffect } from 'react';
import { 
  Package, 
  Filter, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  ArrowUpDown,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Cargo, CargoStatus, CargoType } from '@/data/mockData';
import { CargoForm } from './CargoForm';

export function CargoPage() {
  const { cargo, deleteCargo, modules } = useData();
  const { user } = useAuth();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CargoStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CargoType | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Cargo>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort cargo
  const filteredCargo = cargo
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      // Handle string and number comparisons
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        const aVal = (a[sortField] as string).toLowerCase();
        const bVal = (b[sortField] as string).toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        const aVal = a[sortField];
        const bVal = b[sortField];
        return sortDirection === 'asc' 
          ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0)
          : (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
      }
    });
  
  // Get module name
  const getModuleName = (moduleId?: string) => {
    if (!moduleId) return 'Unassigned';
    const module = modules.find(m => m.id === moduleId);
    return module ? module.name : 'Unknown Module';
  };
  
  // Get status style
  const getStatusStyle = (status: CargoStatus) => {
    switch (status) {
      case 'loaded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'unloaded':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'in-transit':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'pending':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };
  
  // Get type style
  const getTypeStyle = (type: CargoType) => {
    switch (type) {
      case 'food':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'equipment':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'experiment':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'medical':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'personal':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    }
  };
  
  // Handle toggle sort
  const handleSort = (field: keyof Cargo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Package className="mr-2 h-8 w-8" />
            Cargo Management
          </h2>
          <p className="text-muted-foreground">
            Manage cargo inventory, assign to modules, and track status
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Cargo</span>
                </span>
                <span className="absolute inset-0 bg-primary/80 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-200"></span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Cargo</DialogTitle>
                <DialogDescription>
                  Enter the details of the new cargo item to add to the inventory
                </DialogDescription>
              </DialogHeader>
              <CargoForm onClose={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cargo by name or destination..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                <span className={statusFilter === 'all' ? 'font-bold' : ''}>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('loaded')}>
                <span className={statusFilter === 'loaded' ? 'font-bold' : ''}>Loaded</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('unloaded')}>
                <span className={statusFilter === 'unloaded' ? 'font-bold' : ''}>Unloaded</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('in-transit')}>
                <span className={statusFilter === 'in-transit' ? 'font-bold' : ''}>In Transit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                <span className={statusFilter === 'pending' ? 'font-bold' : ''}>Pending</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                <span className={typeFilter === 'all' ? 'font-bold' : ''}>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('food')}>
                <span className={typeFilter === 'food' ? 'font-bold' : ''}>Food</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('equipment')}>
                <span className={typeFilter === 'equipment' ? 'font-bold' : ''}>Equipment</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('experiment')}>
                <span className={typeFilter === 'experiment' ? 'font-bold' : ''}>Experiment</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('medical')}>
                <span className={typeFilter === 'medical' ? 'font-bold' : ''}>Medical</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('personal')}>
                <span className={typeFilter === 'personal' ? 'font-bold' : ''}>Personal</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Cargo list */}
      <Card className="bg-card/50 backdrop-blur-sm card-glow">
        <CardHeader>
          <CardTitle>Cargo Inventory</CardTitle>
          <CardDescription>
            Total Items: {filteredCargo.length} {statusFilter !== 'all' && `(filtered by ${statusFilter})`}
            {typeFilter !== 'all' && ` (filtered by ${typeFilter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border/50">
                  <th className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium -ml-2"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </th>
                  <th className="p-2">Type</th>
                  <th className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-2"
                      onClick={() => handleSort('weight')}
                    >
                      Weight
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </th>
                  <th className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-2"
                      onClick={() => handleSort('volume')}
                    >
                      Volume
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Module</th>
                  <th className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-2"
                      onClick={() => handleSort('createdAt')}
                    >
                      Created
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCargo.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-border/30 hover:bg-secondary/30"
                  >
                    <td className="p-2 font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0.5 ${getTypeStyle(item.type)}`}
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span>{item.weight} kg</span>
                    </td>
                    <td className="p-2">
                      <span>{item.volume} m³</span>
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0.5 ${getStatusStyle(item.status)}`}
                      >
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span>{getModuleName(item.moduleId)}</span>
                    </td>
                    <td className="p-2">
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setCurrentCargo(item);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Cargo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => deleteCargo(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Cargo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[200px]">
                              <div className="space-y-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs">Destination: {item.destination}</p>
                                <p className="text-xs">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredCargo.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                      No cargo items found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Cargo</DialogTitle>
            <DialogDescription>
              Update the details of the cargo item
            </DialogDescription>
          </DialogHeader>
          {currentCargo && (
            <CargoForm cargo={currentCargo} onClose={() => setShowEditDialog(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
