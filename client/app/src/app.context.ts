import { createContext } from 'react';
import { User } from './shared';
import { getEmptyUser } from './shared/utils/biz-util';

// Context for sharing data between the components that can't be accessed by props or Router params
export const userContextDefaultValue = {
  user: getEmptyUser(),
  setUser: (state: User) => {},
};
export const UserContext = createContext(userContextDefaultValue);
