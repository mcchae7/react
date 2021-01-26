import { User } from '../shared-model';

export const getEmptyUser = (): User => ({
  id: -1,
  name: '',
  email: '',
});
