import { ReactElement } from 'react';
import { FormConfig, FormAction, FieldValidatorResult } from './component-model';
import { getThemeClassName } from '../utils';

// The Parent Component can access the Children, but it can't update child's props since props is readonly
// Form can generate the children fields with dynamic child's props

export const Form = (props: FormConfig): ReactElement => {
  const componentName = 'form';
  const {
    themes,
    values = {},
    children,
    validatorsResult = {
      resultMap: new Map<string, FieldValidatorResult[]>(),
      valid: true,
      errorMessages: [],
    },
    onAction,
  } = props;
  const { valid } = validatorsResult;
  return (
    <form
      className={getThemeClassName(componentName, themes)}
      onSubmit={(e) => {
        e.preventDefault();
        onAction({ event: e, action: FormAction.submit, values, valid });
      }}
    >
      {children}
    </form>
  );
};
