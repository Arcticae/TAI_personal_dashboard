import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";

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
          <Route exact strict path='*' render={() => "Page not found: 404"}/>
        </Switch>
      </div>
  );
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textareaCount: 1,
      nodeRes: ""
    };
    
  }

  componentWillMount() {
    fetch("http://localhost:6969/")
      .then(res => res.text())
      .then(res => this.setState({nodeRes: res}));
  }

  render() {

      console.log()

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
