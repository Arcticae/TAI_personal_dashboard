import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Dashboard from "./Dashboard.js";
import SignIn from "./SignIn.js";
import NavBar from "./NavBar.js";

function signedIn() {
    return false;    // TODO unmock
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
        <Switch>
          <Route exact strict path='/' component={RootRouter} />
          <Route exact strict path='/dashboard' component={Dashboard}/>
          <Route exact strict path='*' render={() => "404 Page not found"}/>
        </Switch>
      </div>
  );
};


class App extends Component{

  render() {

      console.log()

      return (
          <div>
              <NavBar />
              <Switch>
                  <Route exact strict path='/sign-in' component={SignIn}/>
                  <Route strict path='/' component={InnerRouter}/>
              </Switch>
          </div>
      );
  }
}

export default App;
