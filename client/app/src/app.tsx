import React, { ReactElement, Fragment } from 'react';
import './app.scss';
import { HomeBody } from './pages/home/home-body';
import { HomeHeader } from './pages/home/home-header';

export const App = (): ReactElement => {
  return (
    <Fragment>
      <HomeHeader />
      <HomeBody />
    </Fragment>
  );
};
