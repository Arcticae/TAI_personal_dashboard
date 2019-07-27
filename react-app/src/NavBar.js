import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

class NavBar extends Component{

    signedIn = () => {return true;} // todo unmock

    handleSignIn = () => {}
    handleSignOut = () => {}

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
       <AppBar position="static">
         <Toolbar>
           <Typography color="inherit" variant="h6" className={classes.title}>
             Personal Dashboard
           </Typography>
           {this.signedIn()
            ? <Button color="inherit" onClick={this.handleSignOut}>Sign out</Button> // username maybe?
            : <Button color="inherit" onClick={this.handleSignIn}>Sign in</Button>
           }
         </Toolbar>
       </AppBar>
     </div>
        );
    }
}

export default withStyles(styles)(NavBar);