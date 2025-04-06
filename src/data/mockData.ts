
// Mock data for Space Cargo Management System

// User types
export type UserRole = 'admin' | 'astronaut' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Cargo types
export type CargoStatus = 'loaded' | 'unloaded' | 'in-transit' | 'pending';
export type CargoType = 'food' | 'equipment' | 'experiment' | 'medical' | 'personal';

export interface Cargo {
  id: string;
  name: string;
  type: CargoType;
  weight: number; // in kg
  volume: number; // in m³
  status: CargoStatus;
  moduleId?: string;
  destination: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// Astronaut types
export type AstronautStatus = 'active' | 'in-transit' | 'on-leave' | 'training';

export interface Astronaut {
  id: string;
  name: string;
  rank: string;
  specialty: string;
  status: AstronautStatus;
  moduleId?: string;
  missionCount: number;
  avatar?: string;
  bio: string;
}

// Module types
export type ModuleStatus = 'active' | 'maintenance' | 'docking' | 'offline';

export interface Module {
  id: string;
  name: string;
  status: ModuleStatus;
  capacity: number; // total capacity in m³
  usedCapacity: number; // used capacity in m³
  location: string;
  astronautCount: number;
  cargoCount: number;
  lastMaintenance: string;
}

// Mission types
export type MissionStatus = 'planned' | 'in-progress' | 'completed' | 'aborted';

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  startDate: string;
  endDate?: string;
  description: string;
  moduleIds: string[];
  astronautIds: string[];
  cargoIds: string[];
}

// Generate mock users
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "John Administrator",
    email: "john@spacehack.com",
    role: "admin",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-002",
    name: "Sarah Astronaut",
    email: "sarah@spacehack.com",
    role: "astronaut",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-003",
    name: "Mike Technician",
    email: "mike@spacehack.com",
    role: "staff",
    avatar: "/placeholder.svg"
  }
];

// Generate mock cargo
export const mockCargo: Cargo[] = [
  {
    id: "cargo-001",
    name: "Water Supply",
    type: "food",
    weight: 500,
    volume: 0.8,
    status: "loaded",
    moduleId: "module-001",
    destination: "ISS",
    assignedTo: "user-002",
    createdAt: "2025-02-10T14:00:00Z",
    updatedAt: "2025-02-11T09:30:00Z"
  },
  {
    id: "cargo-002",
    name: "Experimental Equipment",
    type: "equipment",
    weight: 320,
    volume: 1.2,
    status: "in-transit",
    moduleId: "module-002",
    destination: "Lunar Base",
    createdAt: "2025-01-20T10:15:00Z",
    updatedAt: "2025-01-25T16:45:00Z"
  },
  {
    id: "cargo-003",
    name: "Medical Supplies",
    type: "medical",
    weight: 150,
    volume: 0.5,
    status: "pending",
    destination: "Mars Outpost",
    createdAt: "2025-03-05T08:30:00Z",
    updatedAt: "2025-03-05T08:30:00Z"
  },
  {
    id: "cargo-004",
    name: "Personal Items",
    type: "personal",
    weight: 75,
    volume: 0.3,
    status: "unloaded",
    moduleId: "module-001",
    destination: "ISS",
    assignedTo: "user-002",
    createdAt: "2025-02-01T12:00:00Z",
    updatedAt: "2025-02-15T18:20:00Z"
  },
  {
    id: "cargo-005",
    name: "Scientific Samples",
    type: "experiment",
    weight: 200,
    volume: 0.4,
    status: "loaded",
    moduleId: "module-003",
    destination: "Earth",
    createdAt: "2025-03-10T09:45:00Z",
    updatedAt: "2025-03-12T14:30:00Z"
  }
];

// Generate mock astronauts
export const mockAstronauts: Astronaut[] = [
  {
    id: "astro-001",
    name: "Dr. Eliza Shannon",
    rank: "Commander",
    specialty: "Mission Specialist",
    status: "active",
    moduleId: "module-001",
    missionCount: 6,
    avatar: "/placeholder.svg",
    bio: "Dr. Shannon has led multiple missions to the ISS and holds a Ph.D in Astrophysics."
  },
  {
    id: "astro-002",
    name: "Major David Chen",
    rank: "Pilot",
    specialty: "Navigation",
    status: "active",
    moduleId: "module-001",
    missionCount: 4,
    avatar: "/placeholder.svg",
    bio: "Major Chen is an experienced pilot with over 2000 hours of flight time in various spacecraft."
  },
  {
    id: "astro-003",
    name: "Dr. James Wilson",
    rank: "Science Officer",
    specialty: "Biology",
    status: "training",
    missionCount: 2,
    avatar: "/placeholder.svg",
    bio: "Dr. Wilson specializes in space biology experiments and has authored numerous research papers."
  },
  {
    id: "astro-004",
    name: "Lt. Sophia Rodriguez",
    rank: "Engineer",
    specialty: "Mechanical Systems",
    status: "in-transit",
    moduleId: "module-002",
    missionCount: 3,
    avatar: "/placeholder.svg",
    bio: "Lt. Rodriguez is an expert in spacecraft maintenance and has solved critical mechanical issues during previous missions."
  }
];

// Generate mock modules
export const mockModules: Module[] = [
  {
    id: "module-001",
    name: "Harmony",
    status: "active",
    capacity: 100,
    usedCapacity: 65,
    location: "ISS",
    astronautCount: 2,
    cargoCount: 5,
    lastMaintenance: "2025-01-15T00:00:00Z"
  },
  {
    id: "module-002",
    name: "Tranquility",
    status: "docking",
    capacity: 120,
    usedCapacity: 30,
    location: "En Route to Lunar Base",
    astronautCount: 1,
    cargoCount: 3,
    lastMaintenance: "2025-02-20T00:00:00Z"
  },
  {
    id: "module-003",
    name: "Discovery",
    status: "maintenance",
    capacity: 80,
    usedCapacity: 10,
    location: "Earth Orbit",
    astronautCount: 0,
    cargoCount: 1,
    lastMaintenance: "2025-03-10T00:00:00Z"
  },
  {
    id: "module-004",
    name: "Perseverance",
    status: "offline",
    capacity: 150,
    usedCapacity: 0,
    location: "Lunar Base",
    astronautCount: 0,
    cargoCount: 0,
    lastMaintenance: "2025-01-05T00:00:00Z"
  }
];

// Generate mock missions
export const mockMissions: Mission[] = [
  {
    id: "mission-001",
    name: "ISS Resupply",
    status: "in-progress",
    startDate: "2025-02-10T00:00:00Z",
    endDate: "2025-02-25T00:00:00Z",
    description: "Regular resupply mission to the International Space Station",
    moduleIds: ["module-001"],
    astronautIds: ["astro-001", "astro-002"],
    cargoIds: ["cargo-001", "cargo-004"]
  },
  {
    id: "mission-002",
    name: "Lunar Base Expansion",
    status: "planned",
    startDate: "2025-04-15T00:00:00Z",
    description: "Mission to expand the Lunar Base with new equipment and personnel",
    moduleIds: ["module-002", "module-004"],
    astronautIds: ["astro-003", "astro-004"],
    cargoIds: ["cargo-002"]
  },
  {
    id: "mission-003",
    name: "Mars Sample Return",
    status: "completed",
    startDate: "2024-11-08T00:00:00Z",
    endDate: "2025-01-20T00:00:00Z",
    description: "Recovery of scientific samples from Mars surface",
    moduleIds: ["module-003"],
    astronautIds: ["astro-001", "astro-004"],
    cargoIds: ["cargo-005"]
  }
];

// Dashboard statistics
export const mockStats = {
  totalCargo: 15,
  pendingCargo: 3,
  activeAstronauts: 8,
  availableModules: 3,
  activeModules: 1,
  cargoCapacityUsed: 42, // percentage
  upcomingMissions: 2,
  activeMissions: 1
};

// Activity logs
export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  details: string;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-001",
    action: "Cargo Loaded",
    userId: "user-003",
    timestamp: "2025-03-12T14:30:45Z",
    details: "Water Supply loaded onto Harmony module"
  },
  {
    id: "log-002",
    action: "Module Status Change",
    userId: "user-001",
    timestamp: "2025-03-12T10:15:22Z",
    details: "Tranquility module status changed from offline to docking"
  },
  {
    id: "log-003",
    action: "Astronaut Assignment",
    userId: "user-001",
    timestamp: "2025-03-11T16:45:33Z",
    details: "Lt. Sophia Rodriguez assigned to mission Lunar Base Expansion"
  },
  {
    id: "log-004",
    action: "Cargo Created",
    userId: "user-003",
    timestamp: "2025-03-10T09:22:17Z",
    details: "New cargo 'Scientific Samples' created"
  },
  {
    id: "log-005",
    action: "System Maintenance",
    userId: "user-001",
    timestamp: "2025-03-09T23:11:05Z",
    details: "System backup and maintenance performed"
  }
];
