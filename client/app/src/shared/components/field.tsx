import { ReactElement, useState } from 'react';
import { FieldConfig, FieldType, TextConfig, FieldActionEvent } from './component-model';
import { Text } from './text';
import { getThemeClassName, isEmpty } from '../utils';
import './field.scss';
import './field.themes.scss';

interface FieldState {
  className: string;
  errorMessages?: string[];
}

export const Field = (props: FieldConfig): ReactElement => {
  const componentName = 'field';
  const {
    themes,
    type = FieldType.text,
    label,
    name,
    value,
    placeholder,
    readOnly,
    disabled,
    debounceTime,
    validators,
    onAction,
  } = props;

  const defaultState = {
    className: getThemeClassName(componentName, themes),
    errorMessages: [],
  };
  const [state, setState] = useState<FieldState>(defaultState);

  const onFieldAction = (e: FieldActionEvent) => {
    const { valid, validatorsResult } = e;
    if (!valid) {
      setState({
        className: getThemeClassName(componentName, themes, ['invalid']),
        errorMessages: validatorsResult?.errorMessages,
      });
    } else {
      setState(defaultState);
    }
    if (onAction) {
      onAction(e);
    }
  };

  switch (type) {
    default:
      const textConfig: TextConfig = {
        themes,
        type,
        name,
        value: isEmpty(value) ? '' : value + '',
        placeholder,
        readOnly,
        disabled,
        debounceTime,
        validators,
        onAction: (e) => onFieldAction(e),
      };
      return (
        <div className={state.className}>
          {label ? <div className="field-label">{label}</div> : ''}
          <div className="field-field">
            <Text {...textConfig} />
          </div>
          <div className="field-error">
            {state.errorMessages?.map((message) => (
              <div className="field-error-message" key={message}>
                {message}
              </div>
            ))}
          </div>
        </div>
      );
  }
};
