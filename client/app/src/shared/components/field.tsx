import React, { ReactElement, useState } from 'react';
import { FieldConfig, FieldType, TextConfig, FieldActionEvent } from './component-model';
import { Text } from './text';
import { getThemeClassName } from '../utils';

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
    value = '',
    placeholder,
    readOnly,
    disabled,
    debounceTime,
    onAction,
  } = props;
  const [state, setState] = useState<FieldState>({
    className: getThemeClassName(componentName, themes),
    errorMessages: [],
  });

  const onFieldAction = (e: FieldActionEvent) => {
    const { valid, validatorsResult } = e;
    if (!valid) {
      setState({
        className: getThemeClassName(componentName, themes, ['invalid']),
        errorMessages: validatorsResult?.errorMessages,
      });
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
        value: value + '',
        placeholder,
        readOnly,
        disabled,
        debounceTime,
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
