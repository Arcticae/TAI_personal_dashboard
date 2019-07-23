import React, { Component } from 'react';
import Memo from "./DashboardElements/Memo.js"


class Dashboard extends Component{

    componentDidMount() {
        // TODO fetch memos
    }

    signedIn = () => {return true;} // todo unmock

    render() {
        return (
            <div>
            {this.signedIn()
                ?
                <div>
                    <Memo />
                    <Memo />
                    <Memo />
                </div>
                :
                <p style={{marginLeft: 10}}>
                    Please sign in to access memos.
                </p>
            }
            </div>
        );
    }
}

export default Dashboard;