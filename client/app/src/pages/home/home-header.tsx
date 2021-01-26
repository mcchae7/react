import { Fragment, ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../app.context';
import { getEmptyUser } from '../../shared/utils/biz-util';
export const HomeHeader = (): ReactElement => {
  const { user, setUser } = useContext(UserContext);
  const getUserInfo = () => {
    console.log(user);
    return user.email ? (
      <Fragment>
        &nbsp; | <span>User ID: {user.email || 'guest'}</span> |&nbsp;
        <a href="#" onClick={() => setUser(getEmptyUser())}>
          Sign Out
        </a>
      </Fragment>
    ) : (
      <Fragment>
        &nbsp; | <span>User ID: {user.email || 'guest'}</span>
      </Fragment>
    );
  };
  return (
    <div className="home-header">
      <Link to="/">Home</Link> | <Link to="/signin">Sign In</Link> | <Link to="/signup">Sign Up</Link>
      {getUserInfo()}
    </div>
  );
};
