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

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
       <AppBar position="static">
         <Toolbar>
           <Typography color="inherit" variant="h6" className={classes.title}>
             Personal Dashboard
           </Typography>
           <Button color="inherit">Sign in</Button>
         </Toolbar>
       </AppBar>
     </div>
        );
    }
}

export default withStyles(styles)(NavBar);