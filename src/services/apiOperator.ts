import axios from 'axios';
import { Operator } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

// Lista di indirizzi da interrogare
const addressList = [
  "0x54B827DF9fc7c072Acff349a9A007EC49e473215",
  "0x112F40B5Db93ceCe802F960Aa36DF1E0DB31e7dB",

];

export const getOperators = async (): Promise<Operator[]> => {
  const results = await Promise.all(
    addressList.map(async (address) => {
      const response = await axios.get(`${API_BASE_URL}/api/operators/info/${address}`);
      // Adatta questa parte in base alla struttura della risposta dell'API
      const data = response.data.data;
      return {
        address: data.address,
        registered: data.registered,
        reputationBalance: data.reputationBalance,
      } as Operator;
    })
  );
  return results;
};