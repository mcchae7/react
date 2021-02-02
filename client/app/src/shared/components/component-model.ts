import { AxisDomain, AxisScale, ScaleBand, ScaleLinear } from 'd3';
import { PropsWithChildren, ChangeEvent, SyntheticEvent, KeyboardEvent, FocusEvent } from 'react';
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
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  pattern?: string;
  autoComplete?: string;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent) => void;
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

export interface BarConfig extends ComponentConfig {
  data: Array<any>;
  width: number;
  left: number;
  right: number;
  height: number;
  top: number;
  bottom: number;
}

export interface XAxisConfig extends ComponentConfig {
  top: number;
  right: number;
  left: number;
  bottom: number;
  height: number;
  scale: ScaleBand<string>;
}

export interface YAxisConfig extends ComponentConfig {
  top: number;
  right: number;
  left: number;
  bottom: number;
  scale: ScaleLinear<number, number, never>;
}

export interface RectConfig extends ComponentConfig {
  top: number;
  bottom: number;
  height: number;
  x: ScaleBand<string>;
  y: ScaleLinear<number, number, never>;
  data: any;
}

export interface VisualizerConfig extends ComponentConfig {
  type: VisualizerType;
  barConfig?: BarConfig;
  boxplotConfig?: BoxplotConfig;
  dataFields?: Array<string>;
  data2Fields?: Array<string>; // for bar-line chart etc.
  labelField?: string;
  hasGrid?: boolean;
  data: VisualizerData;
  ticks?: number;
  scalePadding?: number;
  scalePaddingInner?: number;
  scalePaddingOuter?: number;
  decorationMaxRate?: number;
  isManualRender?: boolean;
  onAction: (event: VisualizerActionEvent) => void;
}

export interface BarConfig {
  barWidth?: number;
}

export interface BoxplotConfig {
  boxplotField: BoxplotField;
}

// ******* Action Event

export interface ComponentActionEvent<T> {
  action: T;
  event?: SyntheticEvent;
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

export interface VisualizerActionEvent extends ComponentActionEvent<VisualizerAction> {
  config?: VisualizerConfig;
  renderInfo?: VisualizerRenderInfo;
  visualizerSize?: VisualizerSize;
}

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

export interface VisualizerData {
  columns: Array<Column>;
  data: Array<any>;
}

export interface VisualizerItemDomain {
  min: number;
  max: number;
}

export interface VisualizerUnit {
  yScale?: any;
  yAxis?: any;
  xScale?: any;
  // rect group
  xScaleInner?: any;
  xAxis?: any;
  y2Scale?: any;
  y2Axis?: any;
  labels?: Array<string>;
  colorScale?: any;
  fields?: Array<string>;
  fields2?: Array<string>;
  minMax?: MinMax;
  minMax2?: MinMax;
  // line
  line?: any;
}

export interface VisualizerRenderInfo {
  svg?: any;
  unit?: VisualizerUnit;
  size?: VisualizerSize;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface Column {
  field?: string; // field name;
  name?: string; // column name
  type?: DataType;
  width?: number;
  sort?: boolean;
  sortDirection?: SortDirection;
  fixedWidth?: boolean;
  class?: string;
  align?: Align;
  noOverflowMask?: boolean;
  selectable?: boolean;
  selectableHeader?: boolean;
  selected?: boolean; // for selectable header
}

export interface VisualizerChartSize {
  width?: number;
  height?: number;
  rotateXAxisText?: boolean;
}

export interface Margin {
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
}
export interface VisualizerSize {
  width: number;
  height: number;
  // container - margin size for easy using.
  chart?: VisualizerChartSize;
  margin?: Margin;
}

export interface Box {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

export interface BoxplotField {
  start: string;
  end: string;
  max: string;
  min: string;
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

export enum VisualizerType {
  GRID,
  BAR,
  HORIZONTAL_BAR,
  LINE,
  BAR_LINE,
  BOXPLOT,
  STOCK,
}

export enum VisualizerScaleType {
  LINEAR,
  BAND,
}

export enum VisualizerMetaField {
  total = '__total__',
}

export enum VisualizerAction {
  SELECT_ITEM = 'SELECT_ITEM',
  RENDERED = 'RENDERED',
  BEFORE_RENDER = 'BEFORE_RENDER',
}

export enum DataType {
  STRING,
  NUMBER,
  DATE,
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum Align {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export enum Location {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}
