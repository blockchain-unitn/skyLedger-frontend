import axios from 'axios';
import { RouteLoggings } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

export const getRouteById = async (id: number): Promise<RouteLoggings | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/route-logs/log/${id}`);
    const routeLog = response.data.data;
    if (!routeLog) return null;
    return routeLog
  } catch (error) {
    return null;
  }
};

// Funzione per ottenere tutti i route logging
export const getRouteLoggings = async (): Promise<RouteLoggings[]> => {
  const routeLoggings: RouteLoggings[] = [];
  let id = 0;
  while (true) {
    const log = await getRouteById(id);
    if (!log) break;
    routeLoggings.push(log);
    id++;
  }

  const routeLoggingsList: RouteLoggings[] = routeLoggings.map((log: any) => ({
    droneId: log.droneId,
    utmAuthorizer: log.utmAuthorizer,
    zones: log.zones,
    startPoint: {
      latitude: log.startPoint.latitude,
      longitude: log.startPoint.longitude,
    },
    endPoint: {
      latitude: log.endPoint.latitude,
      longitude: log.endPoint.longitude,
    },
    route: (log.route || []).map((point: any) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })),
    startTime: log.startTime,
    endTime: log.endTime,
    status: log.status,
  }));

  return routeLoggingsList;
};