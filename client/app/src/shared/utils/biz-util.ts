import { User } from '../shared-model';

export const getEmptyUser = (): User => ({
  user_id: -1,
  user_name: '',
  email: '',
});
