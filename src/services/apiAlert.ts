import axios from 'axios';
import { Alert } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

export const getViolations = async (): Promise<Alert[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/violations/all`);
  const { droneIDs, positions, timestamps } = response.data.data;

  const alerts: Alert[] = droneIDs.map((droneID: string, index: number) => ({
    droneID,
    position: positions[index],
    timestamp: timestamps[index],
  }));

  return alerts;
};