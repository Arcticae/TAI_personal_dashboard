import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from "./Dashboard.js";
import SignIn from "./SignIn.js";
import NavBar from "./NavBar.js";
import ProtectedRoute from "./ProtectedRoute.js";

function signedIn() {
    const token = localStorage.getItem('token');
    return token !== null && token.length > 0;
}

const RootRouter = () => {
  return (
      <Route
          render={() => (
              signedIn()
                  ? <Redirect to={{pathname: "/dashboard"}}/>
                  : <Redirect to={{pathname: "/sign-in"}}/>
          )}
      />
  );
}

const InnerRouter = (props) => {
  return (
      <div>
        <NavBar history={props.history}/>
        <Switch>
          <Route exact strict path='/' component={RootRouter} />
          <ProtectedRoute exact strict path='/dashboard' component={Dashboard}/>
          <Route exact strict path='*' render={() => "404 Page not found"}/>
        </Switch>
      </div>
  );
};


class App extends Component{

  componentWillMount() {
    localStorage.removeItem('token');
  }

  render() {

      return (
          <div>
              <Switch>
                  <Route exact strict path='/sign-in' component={SignIn}/>
                  <Route strict path='/' component={InnerRouter}/>
              </Switch>
          </div>
      );
  }
}

export default App;
