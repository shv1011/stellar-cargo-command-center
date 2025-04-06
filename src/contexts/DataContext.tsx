
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockCargo, mockAstronauts, mockModules, mockMissions, mockActivityLogs,
  Cargo, Astronaut, Module, Mission, ActivityLog, CargoStatus, CargoType, ModuleStatus
} from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  // Data
  cargo: Cargo[];
  astronauts: Astronaut[];
  modules: Module[];
  missions: Mission[];
  activityLogs: ActivityLog[];
  
  // Cargo operations
  addCargo: (cargo: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCargo: (id: string, updates: Partial<Cargo>) => void;
  deleteCargo: (id: string) => void;
  
  // Astronaut operations
  addAstronaut: (astronaut: Omit<Astronaut, 'id'>) => void;
  updateAstronaut: (id: string, updates: Partial<Astronaut>) => void;
  deleteAstronaut: (id: string) => void;
  
  // Module operations
  addModule: (module: Omit<Module, 'id'>) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  
  // Mission operations
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  
  // Filters
  cargoTypeFilter: CargoType | 'all';
  setCargoTypeFilter: (filter: CargoType | 'all') => void;
  cargoStatusFilter: CargoStatus | 'all';
  setCargoStatusFilter: (filter: CargoStatus | 'all') => void;
  moduleStatusFilter: ModuleStatus | 'all';
  setModuleStatusFilter: (filter: ModuleStatus | 'all') => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for data
  const [cargo, setCargo] = useState<Cargo[]>(mockCargo);
  const [astronauts, setAstronauts] = useState<Astronaut[]>(mockAstronauts);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  
  // State for filters
  const [cargoTypeFilter, setCargoTypeFilter] = useState<CargoType | 'all'>('all');
  const [cargoStatusFilter, setCargoStatusFilter] = useState<CargoStatus | 'all'>('all');
  const [moduleStatusFilter, setModuleStatusFilter] = useState<ModuleStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { toast } = useToast();
  
  // Generate a new ID for items
  const generateId = (prefix: string) => {
    return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
  };
  
  // Log an activity
  const logActivity = (action: string, userId: string, details: string) => {
    const newLog: ActivityLog = {
      id: generateId('log'),
      action,
      userId,
      timestamp: new Date().toISOString(),
      details
    };
    
    setActivityLogs(prev => [newLog, ...prev]);
  };
  
  // Cargo operations
  const addCargo = (cargoData: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCargo: Cargo = {
      ...cargoData,
      id: generateId('cargo'),
      createdAt: now,
      updatedAt: now
    };
    
    setCargo(prev => [...prev, newCargo]);
    toast({
      title: "Cargo Added",
      description: `${newCargo.name} has been added to the inventory.`
    });
    
    logActivity('Cargo Created', 'user-001', `New cargo '${newCargo.name}' created`);
  };
  
  const updateCargo = (id: string, updates: Partial<Cargo>) => {
    setCargo(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
        : item
    ));
    
    toast({
      title: "Cargo Updated",
      description: `Cargo has been updated successfully.`
    });
    
    logActivity('Cargo Updated', 'user-001', `Cargo '${id}' updated`);
  };
  
  const deleteCargo = (id: string) => {
    const cargoToDelete = cargo.find(c => c.id === id);
    if (!cargoToDelete) return;
    
    setCargo(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Cargo Deleted",
      description: `${cargoToDelete.name} has been removed from the inventory.`
    });
    
    logActivity('Cargo Deleted', 'user-001', `Cargo '${cargoToDelete.name}' deleted`);
  };
  
  // Astronaut operations
  const addAstronaut = (astronautData: Omit<Astronaut, 'id'>) => {
    const newAstronaut: Astronaut = {
      ...astronautData,
      id: generateId('astro')
    };
    
    setAstronauts(prev => [...prev, newAstronaut]);
    
    toast({
      title: "Astronaut Added",
      description: `${newAstronaut.name} has been added to the roster.`
    });
    
    logActivity('Astronaut Added', 'user-001', `New astronaut '${newAstronaut.name}' added`);
  };
  
  const updateAstronaut = (id: string, updates: Partial<Astronaut>) => {
    setAstronauts(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates } 
        : item
    ));
    
    toast({
      title: "Astronaut Updated",
      description: `Astronaut information has been updated.`
    });
    
    logActivity('Astronaut Updated', 'user-001', `Astronaut '${id}' updated`);
  };
  
  const deleteAstronaut = (id: string) => {
    const astronautToDelete = astronauts.find(a => a.id === id);
    if (!astronautToDelete) return;
    
    setAstronauts(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Astronaut Removed",
      description: `${astronautToDelete.name} has been removed from the roster.`
    });
    
    logActivity('Astronaut Deleted', 'user-001', `Astronaut '${astronautToDelete.name}' removed`);
  };
  
  // Module operations
  const addModule = (moduleData: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...moduleData,
      id: generateId('module')
    };
    
    setModules(prev => [...prev, newModule]);
    
    toast({
      title: "Module Added",
      description: `${newModule.name} has been added to the system.`
    });
    
    logActivity('Module Added', 'user-001', `New module '${newModule.name}' added`);
  };
  
  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates } 
        : item
    ));
    
    toast({
      title: "Module Updated",
      description: `Module information has been updated.`
    });
    
    logActivity('Module Updated', 'user-001', `Module '${id}' updated`);
  };
  
  const deleteModule = (id: string) => {
    const moduleToDelete = modules.find(m => m.id === id);
    if (!moduleToDelete) return;
    
    setModules(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Module Removed",
      description: `${moduleToDelete.name} has been removed from the system.`
    });
    
    logActivity('Module Deleted', 'user-001', `Module '${moduleToDelete.name}' removed`);
  };
  
  // Mission operations
  const addMission = (missionData: Omit<Mission, 'id'>) => {
    const newMission: Mission = {
      ...missionData,
      id: generateId('mission')
    };
    
    setMissions(prev => [...prev, newMission]);
    
    toast({
      title: "Mission Added",
      description: `${newMission.name} has been added to the mission roster.`
    });
    
    logActivity('Mission Added', 'user-001', `New mission '${newMission.name}' added`);
  };
  
  const updateMission = (id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates } 
        : item
    ));
    
    toast({
      title: "Mission Updated",
      description: `Mission information has been updated.`
    });
    
    logActivity('Mission Updated', 'user-001', `Mission '${id}' updated`);
  };
  
  const deleteMission = (id: string) => {
    const missionToDelete = missions.find(m => m.id === id);
    if (!missionToDelete) return;
    
    setMissions(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Mission Removed",
      description: `${missionToDelete.name} has been removed from the system.`
    });
    
    logActivity('Mission Deleted', 'user-001', `Mission '${missionToDelete.name}' removed`);
  };
  
  return (
    <DataContext.Provider
      value={{
        // Data
        cargo,
        astronauts,
        modules,
        missions,
        activityLogs,
        
        // Cargo operations
        addCargo,
        updateCargo,
        deleteCargo,
        
        // Astronaut operations
        addAstronaut,
        updateAstronaut,
        deleteAstronaut,
        
        // Module operations
        addModule,
        updateModule,
        deleteModule,
        
        // Mission operations
        addMission,
        updateMission,
        deleteMission,
        
        // Filters
        cargoTypeFilter,
        setCargoTypeFilter,
        cargoStatusFilter,
        setCargoStatusFilter,
        moduleStatusFilter,
        setModuleStatusFilter,
        
        // Search
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
