import axios from 'axios';
import { Permissions } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000'; 

export const getFlightPermissions = async (): Promise<Permissions[]> => {
  const response = await axios.get(`${API_BASE_URL}/flight-permissions.json`);
  // Adatta la linea sotto se la risposta è { data: [...] }
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
};