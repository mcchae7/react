import { ReactElement } from 'react';
import { HomeBody } from './home-body';
import { HomeHeader } from './home-header';

export const Home = (): ReactElement => {
  return (
    <div className="home">
      <HomeHeader />
      <HomeBody />
    </div>
  );
};
