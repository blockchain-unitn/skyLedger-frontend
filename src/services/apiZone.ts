import axios from 'axios';
import { Zone } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

export const getZones = async (): Promise<Zone[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/zones`);
  const { data } = response.data;

  const zonesList: Zone[] = data.map((zone: any) => ({
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

  return zonesList;
};