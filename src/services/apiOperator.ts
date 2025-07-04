import axios from 'axios';
import {Operator} from '@/types/apiTypes';

const API_BASE_URL = 'http://localhost:8080'; 

export const getOperators = async (): Promise<Operator[]> => {
  const response = await axios.get(`${API_BASE_URL}/operators.json`);
  const { operators } = response.data;

  const operatorsList: Operator[] = operators.map((op: any) => ({
    address: op.address,
    registered: op.registered,
    reputationBalance: op.reputationBalance,
  }));

  return operatorsList;
};