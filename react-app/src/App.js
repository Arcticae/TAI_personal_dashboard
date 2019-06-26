import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Dashboard from './Dashboard';
import SignIn from "./SignIn";
// import ProtectedRoute from "./ProtectedRoute";

// const RootRouter = () => {
//   return (
//       <Route 
//           render={() => (
//               false
//                   ? <Redirect to={{pathname: "/dashboard"}}/>
//                   : <Redirect to={{pathname: "/sign-in"}}/>
//           )}
//       />
//   );
// }

// const InnerRouter = (props) => {
//   return (
//       <div>
//           <Switch>
//               <Route exact strict path='/' component={RootRouter} />
//               {/* <ProtectedRoute exact strict path='/dashboard' component={Dashboard}/> */}
//               <Route exact strict path='*' render={() => "Page not found: 404"}/>
//           </Switch>
//       </div>
//   );
// };

class App extends Component {
  render() {

      console.log()

      return (
          <div>
              <Switch>
                  <Route exact strict path='/' component={SignIn}/>
                  {/* <Route strict path='/' component={InnerRouter}/> */}
                  <Route exact strict path='*' render={() => "Page not found: 404"}/>
              </Switch>
          </div>
      );
  }
}

export default App;
