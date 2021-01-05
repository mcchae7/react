import React, { ReactElement } from 'react';
import { ButtonConfig, ButtonAction, ButtonType } from './component-model';
import { getThemeClassName } from '../utils';

export const Button = (props: ButtonConfig): ReactElement => {
  const componentName = 'button';
  const { themes, disabled, type = ButtonType.button, children, onAction = () => '' } = props;

  return (
    <button
      className={getThemeClassName(componentName, themes)}
      type={type}
      disabled={disabled}
      onClick={(e) => onAction({ event: e, action: ButtonAction.click })}
    >
      {children}
    </button>
  );
};
