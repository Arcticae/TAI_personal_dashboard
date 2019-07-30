import React from "react";
import {Route, Redirect} from "react-router-dom";
// import Cookies from "js-cookie";

const signedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null && token.length > 0;
}

export const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                props => (
                    signedIn()
                        ? <Component {...props} />
                        : <Redirect to={{pathname: "/sign-in", state: {from: props.location}}}/>
                )
            }
        />
    );
};

export default (ProtectedRoute);
