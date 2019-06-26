import React, { Component } from 'react';

class Dashboard extends Component{

    componentWillMount() {
        fetch("http://localhost:6969/")
            .then(res => res.text())
            .then(res => this.setState({nodeRes: res}));
    }

    render() {
        return (
          <div>XD</div>
        );
    }
}

export default Dashboard;