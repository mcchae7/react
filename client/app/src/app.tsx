import { ReactElement, Fragment, useState, useMemo } from 'react';
import { UserContext } from './app.context';
import './app.scss';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Signin } from './pages/auth/signin';
import { getEmptyUser } from './shared/utils/biz-util';
import { Home } from './pages/home/home';

export const App = (): ReactElement => {
  const [user, setUser] = useState(getEmptyUser());

  return (
    <Router>
      <Fragment>
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" render={() => (user.user_id > -1 ? <Redirect to="/" /> : <Signin />)} />
          </Switch>
        </UserContext.Provider>
      </Fragment>
    </Router>
  );
};
