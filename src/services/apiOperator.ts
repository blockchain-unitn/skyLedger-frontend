import axios from 'axios';
import { Operator } from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:3000';

export const getOperators = async (): Promise<Operator[]> => {
  // 1. Prendi la lista degli address
  const allResponse = await axios.get(`${API_BASE_URL}/api/operators/all`);
  const addressList: string[] = allResponse.data.data;

  // 2. Per ogni address, prendi i dettagli
  const results = await Promise.all(
    addressList.map(async (address) => {
      const response = await axios.get(`${API_BASE_URL}/api/operators/info/${address}`);
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