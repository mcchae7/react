import { ReactElement, useState, useRef, KeyboardEvent, FocusEvent, SyntheticEvent } from 'react';
import { FieldAction, TextConfig, InputConfig } from './component-model';
import { getThemeClassName, debounce, validate, updateValidatorConfig } from '../utils';
import { FieldValidatorType } from '../shared-model';
import './text.scss';

interface TextState {
  className: string;
}

export const Text = (props: TextConfig): ReactElement => {
  const componentName = 'text';

  // init
  const {
    themes,
    name,
    type,
    value = '',
    label,
    placeholder = label || name,
    readOnly = false,
    disabled = false,
    validators = [],
    debounceTime = 0,
    onAction,
  } = props;

  const inputEl = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<TextState>({
    className: getThemeClassName(componentName, themes),
  });

  const validateValue = (event: SyntheticEvent) => {
    if (inputEl.current) {
      const { value } = inputEl.current;
      const validatorConfigs = updateValidatorConfig(validators, {
        field: name,
        label,
        value,
      });
      const validatorsResult = validate(validatorConfigs);
      const { valid } = validatorsResult;
      if (!valid) {
        setState({ className: getThemeClassName(componentName, themes, ['invalid']) });
      }
      if (onAction) {
        onAction({ event, action: FieldAction.change, name, value, valid, validatorsResult });
      }
    }
  };

  const getInputConfig = () => {
    const _onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
      console.log(event);
      validateValue(event);
    };
    const onFocus = (event: FocusEvent) => {
      validateValue(event);
    };
    const onKeyUp = debounce(_onKeyUp, debounceTime);
    const inputConfig: InputConfig = {
      name,
      type,
      defaultValue: value,
      placeholder,
      readOnly,
      disabled,
      autoComplete: 'off',
      onKeyUp: (e) => onKeyUp(e),
      onFocus: (e) => onFocus(e),
    };
    validators.forEach((validator) => {
      switch (validator.type) {
        case FieldValidatorType.max:
          inputConfig.max = Number(validator.targetValue);
          break;
        case FieldValidatorType.min:
          inputConfig.min = Number(validator.targetValue);
          break;
        case FieldValidatorType.minLength:
          inputConfig.minlength = Number(validator.targetValue);
          break;
        case FieldValidatorType.maxLength:
          inputConfig.maxlength = Number(validator.targetValue);
          break;
        case FieldValidatorType.required:
          inputConfig.required = true;
          break;
      }
    });
    return inputConfig;
  };

  return <input ref={inputEl} {...getInputConfig()} className={state.className}></input>;
};
