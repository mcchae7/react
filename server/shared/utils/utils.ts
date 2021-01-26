import { ResponseErrorType, ResponseData } from '../../shared-cs/model';
import { Response } from 'express';

export const sendDBError = (res: Response, error: any, message = '', status = 500) => {
  sendError(res, ResponseErrorType.database, error, message, status);
};

export const sendValidationError = (res: Response, error: any, message = '', status = 400) => {
  sendError(res, ResponseErrorType.validation, error, message, status);
};

export const sendAuthError = (res: Response, error: any, message = '', status = 400) => {
  sendError(res, ResponseErrorType.auth, error, message, status);
};

export const sendError = (
  res: Response,
  type: ResponseErrorType = ResponseErrorType.error,
  error: any,
  message = '',
  status = 500,
) => {
  const data: ResponseData = {
    error: { status, type, error, message },
  };
  res.status(status).json(data);
};
