import { RequestData, ResponseData } from '../shared-model';
import Axios from 'axios';

export const api = async (data: RequestData): Promise<ResponseData> => {
  // const res = await Axios.post('api', data);
  const res = (await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user_id: 1,
          user_name: 'Neo',
          email: data.data.email,
        },
      });
    }, 500);
  })) as Promise<ResponseData>;
  return res;
};
