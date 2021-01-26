import { RequestData, ResponseData } from '../shared-model';
import Axios from 'axios';

export const api = async (data: RequestData): Promise<ResponseData> => {
  return await Axios.post('api', data);
};
