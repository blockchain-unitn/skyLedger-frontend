export enum DroneType {
  MEDICAL = 0,
  CARGO = 1,
  SURVEILLANCE = 2,
  AGRICULTURAL = 3,
  RECREATIONAL = 4,
  MAPPING = 5,
  MILITARY = 6,  // nota: nel contratto c'è MILITAR, correggi in backend o qui se serve
}

export enum ZoneType {
  RURAL = 0,
  URBAN = 1,
  HOSPITALS = 2,
  MILITARY = 3,
  RESTRICTED = 4,
}

export enum DroneStatus {
  ACTIVE = 0,
  MAINTENANCE = 1,
  INACTIVE = 2,
}

export interface Drone {
  tokenId: number;
  serialNumber: string;
  model: string;
  droneType: DroneType;
  certHashes: string[];
  permittedZones: ZoneType[];
  ownerHistory: string[];
  maintenanceHash: string;
  status: DroneStatus;
}

export interface Alert {
  droneID: string;
  position: string;
  timestamp: number;
}
export interface Operator {
  address: string;
  registered: boolean;
  reputationBalance: number;
}

export interface Boundary {
  latitude: number | null;
  longitude: number | null;
}

export interface Zone {
  id: number;
  name: string;
  zoneType: 'RURAL' | 'URBAN' | 'HOSPITALS' | 'MILITARY' | 'RESTRICTED';
  boundaries: Boundary[];
  maxAltitude: number;
  minAltitude: number;
  isActive: boolean;
  description: string;
  createdAt: number;  // Unix timestamp
  updatedAt: number;  // Unix timestamp
}

export enum PreAuthorizationStatus {
    APPROVED = 0,
    FAILED = 1,
}

export interface RouteCharacteristics {
    zones: ZoneType[];
    altitudeLimit: number;
}

export interface RouteRequest {
    droneId: number; // uint256 in Solidity, number if within JS safe integer range
    route: RouteCharacteristics;
}

export interface Permissions {
    droneId: number;
    preauthorizationStatus: PreAuthorizationStatus;
    reason: string;
}

export enum statusLogging {
  NORMAL=0,
  DEVIATED=1
}

export interface RouteLoggings {
  droneId: number;
  utmAuthorizer: string;
  zones: ZoneType[];
  startPoint: {
    latitude: number;
    longitude: number;
  };
  endPoint: {
    latitude: number;
    longitude: number;
  };
  route: {
    latitude: number;
    longitude: number;
  }[];
  startTime: number; // Unix timestamp
  endTime: number;   // Unix timestamp
  status: number;    // puoi creare un enum se serve
}
