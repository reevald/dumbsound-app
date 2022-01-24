import { Route, Switch, Redirect } from 'react-router-dom';
import { useContext, useEffect, useCallback, useState } from 'react';
import { UserContext } from './context/authContext';

// Pages
import HomePage from './pages/homePage';
import SubscribePage from './pages/subscribePage';
import AddArtisPage from './pages/addArtisPage';
import AddMusicPage from './pages/addMusicPage';
import CrudTransactionPage from './pages/crudTransactionPage';


import CompLoadingFullScreen from './component/loading';

import { API } from './config/api';

// Reference:
// https://dev.to/nilanth/how-to-create-public-and-private-routes-using-react-router-72m
// https://github.com/ilhamfathoni2/integration-dewe-tour/blob/master/client/src/App.js
function PrivateRoute({ children, ...rest }) {
  const [stateUser,] = useContext(UserContext);
  const isLogin = stateUser.isLogin;
  console.log("isLogin PrivateRoute", isLogin);

  if (isLogin === null) {
    return null; // alt : <></>
  } else {
    return (
      <Route
        {...rest}
        // error when use history.push() (error render?) (condition: not login, if login is ok)
        render={() => isLogin ? <Switch>{children}</Switch> : <Redirect to='/' />}
      />
    );
  }
}

function AdminRoute({ children, ...rest }) {
  const [stateUser,] = useContext(UserContext);
  const isAdmin = (stateUser.user.listAs === "1") ? true : false;
  return (
    <Route
      {...rest}
      // error when use history.push() (error render?) (condition: not login, if login is ok)
      render={() => (isAdmin) ? children : <Redirect to='/' />}
    />
  );
}

function App() {
  const [, dispatchUser] = useContext(UserContext);
  const [isCheckLoading, setIsCheckLoading] = useState(true);

  const checkUserLogin = useCallback(async () => {
    const api = API(); // inside scope checkUserLogin to avoid infinite loop
    // because every rander make api get update
    try {
      // Using bearer for jwt token (but bearer is only be used over https?)
      // ref: https://swagger.io/docs/specification/authentication/basic-authentication/
      // ref: https://swagger.io/docs/specification/authentication/bearer-authentication/
      // ref: https://stackoverflow.com/a/34022350
      const config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.token
        }
      };
      const response = await api.get("/check-auth", config);
      setIsCheckLoading(false);

      // handle invalid token and error server
      if (response.status === "failed") {
        return dispatchUser({
          type: "AUTH_ERROR"
        });
      }

      if (response.status === "success") {
        return dispatchUser({
          type: "AUTH_SUCCESS",
          payload: response.data,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }, [dispatchUser]);

  // Ref: https://reactjs.org/docs/hooks-effect.html
  // Avoid warning : "React Hook useEffect has a missing dependency blabla",
  // Ref: https://stackoverflow.com/a/60327893 (useCallback)
  useEffect(() => {
    console.log("running wkwk"); // for checking infinite loop
    checkUserLogin();
  }, [checkUserLogin]);

  if (isCheckLoading) {
    return (
      <CompLoadingFullScreen />
    );
  } else {
    return (
      <>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <PrivateRoute>
            <Route exact path="/subscribe" component={SubscribePage} />
            <AdminRoute>
              <Route exact path="/add-artis" component={AddArtisPage} />
              <Route exact path="/add-music" component={AddMusicPage} />
              <Route exact path="/transactions" component={CrudTransactionPage} />
            </AdminRoute>
          </PrivateRoute>
        </Switch>
      </>
    );
  }
}

export default App;
