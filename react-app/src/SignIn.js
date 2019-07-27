import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import api from './API';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 2,
    },
});

const signedIn = () => false;

class SignIn extends Component{

    state = {
        username: "",
        password: "",
        error: false,
    };

    handleLoginError = () => {
        this.state.error = true;
    }

    fetchUserAndRedirect(token){
        api.fetchHandleError(
            api.endpoints.getUserData(token),
            (response) => {
                const user = {
                    userId: response.id,
                    token: token
                };
                localStorage.setItem('user', JSON.stringify(user));
                // todo this.redirectAfterLogin();
            },
            this.handleLoginError.bind(this));
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    submit = () => {
        this.state.error = false;
        console.log(`Signing in with ${this.state.username}:${this.state.password}`);
        api.fetchHandleError(
            api.endpoints.signIn(this.state.username, this.state.password),
            (response) => {
                // todo retrieve token from response
                this.fetchUserAndRedirect(response)
            },
            this.handleLoginError.bind(this)
        )
    };

    register = () => {
        const {name, password} = this.state;

        const data = {
            username: 'whatever',
            password: password,
            email: name
        };
        console.log(`Registering with ${this.state.username}:${this.state.password}`);
        api.fetch(
            api.endpoints.register(data),
            (user) => {
                this.setState({
                    name: '',
                    password: ''
                })
            }
        );
    };

    render() {
        const {classes} = this.props;
        const {error} = this.state;

        if(signedIn())
            return (<Redirect to={{pathname: "/dashboard"}}/>);
        return (
            <main className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {error &&
                    <Typography color="secondary">Incorrect mail or password</Typography>
                    }
                    <br /><br/>
                    <form onSubmit={this.submit}>
                        <label>
                            <Typography component="h4" align="right">
                               Email: <input id="username" type="username" value={this.state.username} onChange={this.handleChange} />
                            </Typography>
                        </label><br/>
                        <label>
                            <Typography component="h4" align="right">
                                Password: <input id="password" type="password" value={this.state.password} onChange={this.handleChange} />
                            </Typography>
                        </label><br />
                        <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={this.submit}>
                            Sign in
                        </Button>
                        <Button fullWidth variant="outlined" color="primary" className={classes.submit} onClick={this.register}>
                            Register
                        </Button>
                    </form>
                </Paper>
            </main>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(SignIn);