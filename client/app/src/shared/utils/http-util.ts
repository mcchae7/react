import { RequestData, ResponseData } from '../shared-model';
import Axios from 'axios';

export const api = async (data: RequestData): Promise<ResponseData> => {
  const res = await Axios.post('api', data);
  return res;
};
