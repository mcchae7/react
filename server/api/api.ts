import { RequestHandler } from 'express';
import { apiUser } from './user/user.api';
import { RequestData, Api, UserAction } from '../shared-cs/model';
export const apiRouter: RequestHandler = (req, res, next) => {
  const { api, action, data } = req.body as RequestData;
  switch (api) {
    case Api.User:
      apiUser(res, action as UserAction, data);
      break;
  }
};
