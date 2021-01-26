import { select, insert } from '../../shared/utils/sql-utils';
import { Response } from 'express';
import { User } from '../../shared-cs/model';
import { compare } from 'bcrypt';
import { sendDBError, sendAuthError } from '../../shared/utils/utils';

export const selectUser = async (res: Response, id: number) => {
  try {
    const data = await select('users', { id });
    res.json({ data });
  } catch (error) {
    sendDBError(res, error);
  }
};

export const selectUserByEmail = async (res: Response, email: string) => {
  try {
    const data = await select('users', { email });
    res.json({ data });
  } catch (error) {
    sendDBError(res, error);
  }
};

export const selectUserByEmailPassword = async (res: Response, email: string, rawPassword: string) => {
  try {
    const data = await select('users', { email }, ['id', 'name', 'email', 'password']);
    console.log(data, rawPassword);
    if (!rawPassword) {
      sendAuthError(res, null, 'Please check your password');
    } else if (data.length) {
      const { password = '' } = data[0] as User;
      compare(rawPassword, password).then((match) => {
        if (match) {
          res.json({ data: data[0] });
        } else {
          sendAuthError(res, null, 'Please check your password');
        }
      });
    } else {
      sendAuthError(res, null, 'Please check your email');
    }
  } catch (error) {
    sendDBError(res, error);
  }
};

export const insertUser = async (res: Response, user: User) => {
  insert('users', user);
  try {
    const data = await insert('users', user);
    selectUserByEmail(res, user.email);
  } catch (error) {
    sendDBError(res, error);
  }
};
