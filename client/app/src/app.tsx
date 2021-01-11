import { ReactElement, Fragment, useState, useMemo } from 'react';
import { UserContext } from './app.context';
import './app.scss';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Signin } from './pages/auth/signin';
import { getEmptyUser } from './shared/utils/biz-util';
import { Home } from './pages/home/home';

export const App = (): ReactElement => {
  const [user, setUser] = useState(getEmptyUser());
  // for re-use the existing value unless it is changed. It will reduce the rendering because it will skip the same value.
  const userContextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <Fragment>
        <UserContext.Provider value={userContextValue}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" render={() => (user.user_id > -1 ? <Redirect to="/" /> : <Signin />)} />
          </Switch>
        </UserContext.Provider>
      </Fragment>
    </Router>
  );
};
