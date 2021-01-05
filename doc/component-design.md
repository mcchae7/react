# Component Design Rules

## folder: Components

## model: Components/component-model.ts

### Config (Config)

Field can be the native fields or custom fields like dropdown...
It needs abstraction.
Also, the fields can be generated dynamically by Form component.

e.g) FieldConfig

```Javascript
/*
themes for custom class names for the business UIs' styles.
Prefix: "mc"
Base Class Name: "mc-component". e.g) mc-text, mc-dropdown, mc-form, mc-grid, mc-list
Business Themes: e.g) List component has ['visualization-list'] => className="mc-list mc-list-visualization-list"
*/
export interface ComponentConfig {
  themes: string[];
}

export interface FieldConfig extends ComponentConfig {
  name: string;
  type?: FieldType;
  value?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  // native validators
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  size?: number;
  pattern?: string;
  // additional validator
  validators?: FieldValidatorConfig[];
  onAction: (e: FieldActionEvent) => void;
}
```

### Action & Event

```Javascript
export interface ComponentActionEvent {
  event: React.SyntheticEvent;
}

export interface FieldActionEvent extends ComponentActionEvent {
  action: FieldAction;
  valid?: boolean;
  value: unknown;
  oldValue: unknown;
}

export enum FieldAction {
  change = 'change',
}
```

e.g) Text Component

```Javascript
import { ReactElement, ChangeEvent } from 'react';
import { FieldAction, FieldConfig } from './component-model';

export const Text = (config: FieldConfig): ReactElement => {
  // init
  const {
    themes = [],
    name,
    type,
    value,
    placeholder = name,
    readonly = false,
    disabled = false,
    min,
    max,
    minlength,
    maxlength,
    required = false,
    size,
    pattern,
    onAction,
  } = config;

  const getClassName = () => {
    // theme class
    const cls = ['nu-field', 'nu-text'].concat(themes);
    return cls.join(' ');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onAction({ event: e, action: FieldAction.change, name, value: e.target.value });
  };
  return (
    <input
      className={getClassName()}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readonly}
      disabled={disabled}
      min={min}
      max={max}
      minLength={minlength}
      maxLength={maxlength}
      required={required}
      size={size}
      pattern={pattern}
      onChange={(e) => onChange(e)}
    ></input>
  );
};
```
