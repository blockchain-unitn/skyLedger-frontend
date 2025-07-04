import axios from 'axios';
import { Zone } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

// Funzione per ottenere una singola zona per id
export const getZoneById = async (id: number): Promise<Zone | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/zones/zone/${id}`);
    const zone = response.data.data;
    if (!zone) return null;
    return {
      id: zone.id,
      name: zone.name,
      zoneType: zone.zoneType,
      boundaries: (zone.boundaries || []).map((b: any) => ({
        latitude: b.latitude,
        longitude: b.longitude,
      })),
      maxAltitude: zone.maxAltitude,
      minAltitude: zone.minAltitude,
      isActive: zone.isActive,
      description: zone.description,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    };
  } catch (error) {
    return null;
  }
};

// Funzione per ottenere tutte le zone by id (da 0 in poi)
export const getZones = async (): Promise<Zone[]> => {
  const zones: Zone[] = [];
  let id = 1;
  while (id < 6) {
    const zone = await getZoneById(id);
    console.log('Zone:', zone);
    if (zone) {
      zones.push(zone);
    }
    id++;
  }
  const zonesList: Zone[] = zones
    .filter(zone => zone && zone.boundaries) // filtra zone undefined o senza boundaries
    .map((zone: any) => ({
      id: zone.id,
      name: zone.name,
      zoneType: zone.zoneType,
      boundaries: (zone.boundaries || []).map((b: any) => ({
        latitude: b.latitude,
        longitude: b.longitude,
      })),
      maxAltitude: zone.maxAltitude,
      minAltitude: zone.minAltitude,
      isActive: zone.isActive,
      description: zone.description,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    }));
  console.log('Zones List:', zonesList);
  return zonesList;
};

/*export const getZones = async (): Promise<Zone[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/zones/`);
  const { data } = response.data;

  const zonesList: Zone[] = data.map((zone: any) => ({
    id: zone.id,
    name: zone.name,
    zoneType: zone.zoneType,
    boundaries: zone.boundaries.map((b: any) => ({
      latitude: b.latitude,
      longitude: b.longitude,
    })),
    maxAltitude: zone.maxAltitude,
    minAltitude: zone.minAltitude,
    isActive: zone.isActive,
    description: zone.description,
    createdAt: zone.createdAt,
    updatedAt: zone.updatedAt,
  }));

  return zonesList;
};*/

