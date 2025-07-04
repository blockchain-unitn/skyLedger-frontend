import axios from 'axios';
import { Drone, DroneType, ZoneType, DroneStatus } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000'; // Update as needed

export const getDrones = async (): Promise<Drone[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/drones/all`);
  const data = response.data;
  console.log("API response:", data);

  // Se la risposta è { success: true, data: [...] }
  return Array.isArray(data.data) ? data.data : [];
};
