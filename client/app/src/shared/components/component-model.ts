import { PropsWithChildren, ChangeEvent, SyntheticEvent, KeyboardEvent } from 'react';
import { FieldValidatorConfig } from '../shared-model';

/************ Interfaces *************/
// ********* Config
/*
themes for custom class names for the business UIs' styles.
Prefix: "mc"
Base Class Name: "mc-component". e.g) mc-text, mc-dropdown, mc-form, mc-grid, mc-list
Business Themes: e.g) List component has ['visualization-list'] => className="mc-list mc-list-visualization-list"
*/
export interface ComponentConfig extends PropsWithChildren<unknown> {
  themes?: string[]; // class names
}

export interface FieldConfig extends ComponentConfig {
  name: string;
  type?: FieldType;
  value?: unknown;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  debounceTime?: number; // ms
  // additional validator
  validators?: FieldValidatorConfig[];
  onAction?: (event: FieldActionEvent) => void;
}

export interface TextConfig extends FieldConfig {
  value?: string;
}

export interface InputConfig {
  className?: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  pattern?: string;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface FormConfig extends ComponentConfig {
  values?: any;
  validatorsResult?: FieldValidatorsResult;
  onAction: (event: FormActionEvent) => void;
}

export interface ButtonConfig extends ComponentConfig {
  type?: ButtonType;
  hasFocus?: boolean;
  disabled?: boolean;
  onAction?: (event: ButtonActionEvent) => void;
}

// ******* Action Event

export interface ComponentActionEvent<T> {
  action: T;
  event: SyntheticEvent;
}

export interface FieldActionEvent extends ComponentActionEvent<FieldAction> {
  name: string;
  type?: FieldType;
  valid?: boolean;
  value: unknown;
  oldValue?: unknown;
  validators?: FieldValidatorConfig[];
  validatorsResult?: FieldValidatorsResult;
}

export interface FormActionEvent extends ComponentActionEvent<FormAction> {
  fieldEvent?: FieldActionEvent;
  valid?: boolean;
  values: any;
}

export type ButtonActionEvent = ComponentActionEvent<ButtonAction>;

// ******** General Interfaces

export interface FieldValidatorResult {
  field: string;
  errorMessage: string;
  value?: unknown;
  valid: boolean;
}

export interface FieldValidatorsResult {
  resultMap: Map<string, FieldValidatorResult[]>;
  valid: boolean;
  errorMessages: string[];
}

/************ Enum *******************/

export enum FormAction {
  submit = 'submit',
  change = 'change',
}

export enum ButtonAction {
  click = 'click',
}

export enum FieldAction {
  change = 'change',
  focus = 'focus',
  blur = 'blur',
}

export enum FieldType {
  text = 'text',
  number = 'number',
  email = 'email',
  password = 'password',
}

export enum ButtonType {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}
