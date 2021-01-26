// **** to use for server and client ***

/********* Interfaces *******/

// *** Data Type ***
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

// *** API ***
export interface RequestData {
  api: Api; // e.g) Api.User
  action?: string; // e.g) UserAction.read, default is 'read' usually.
  data?: any; // User
}

export interface ResponseData {
  error?: ResponseError;
  data?: any;
}

export interface ResponseError {
  status: number;
  type: ResponseErrorType;
  error: any;
  message?: string;
}

// *** Validation ***

export interface FieldValidatorConfig {
  field?: string;
  label?: string;
  value?: unknown;
  targetField?: string;
  targetFieldLabel?: string;
  targetFieldValue?: unknown;
  type?: FieldValidatorType;
  errorMessage?: string;
  targetValue?: unknown; // min|max|minlength|maxlength|pattern ....
}

/************ enums ***************/
export enum ResponseErrorType {
  database = 'database',
  validation = 'validation',
  auth = 'auth',
  error = 'error',
}

// **** Api ID & Action ****

export enum Api {
  User = 'User',
}

export enum UserAction {
  create = 'create',
  update = 'update',
  delete = 'delete',
  read = 'read',
  auth = 'auth',
}

// **** Validator ****

// Validator will cover the validations except the native validators
export enum FieldValidatorType {
  equal = 'equal',
  min = 'min',
  max = 'max',
  minLength = 'minlength',
  maxLength = 'maxlength',
  required = 'required',
  pattern = 'pattern',
}
