import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import api from './API.js';

const styles = (theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

class NavBar extends Component{

    signedIn = () => {
      const token = localStorage.getItem('token');
      return token !== null && token.length > 0;
    }

    handleSignIn = () => {}
    handleSignOut = () => {
      api.fetchNoContent(
        api.endpoints.signOut({
          token: localStorage.getItem('token')
        }),
      (response) => {});

      localStorage.removeItem('token');
      this.props.history.push('/sign-in');
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
       <AppBar position="static">
         <Toolbar>
           <Typography color="inherit" variant="h6" className={classes.title}>
             {`${localStorage.getItem('user')}'s Personal Dashboard`}
           </Typography>
           {this.signedIn()
            ? <Button color="inherit" onClick={this.handleSignOut}>Sign out</Button>
            : <Button color="inherit" onClick={this.handleSignIn}>Sign in</Button>
           }
         </Toolbar>
       </AppBar>
     </div>
        );
    }
}

export default withStyles(styles)(NavBar);