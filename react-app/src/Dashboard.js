import React, { Component } from 'react';
import Memo from "./DashboardElements/Memo.js"
import { Button } from '@material-ui/core';
import uuid from "./uuid.js"


class Dashboard extends Component{

    state = {
        memos: []
    }
    componentDidMount() {
        // TODO fetch memos
    }

    handleDelete = (id) => {
        const memos = this.state.memos.filter(m => m.id !== id);
        this.setState({memos});
    }

    handleAdd = () => {
        const memos = [{id: uuid(), text: '', edit: true}].concat(this.state.memos);
        this.setState({memos});
    }

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <Button variant="contained" onClick={this.handleAdd} style={{marginTop: 10}}>
                    ADD
                </Button>
                {this.state.memos.length > 0
                ?
                <div>
                    {this.state.memos.map(memo => <Memo
                        key={memo.id}
                        id={memo.id}
                        text={memo.text}
                        onDelete={this.handleDelete}
                        edit={memo.edit}
                        />)}
                </div>
                : <p> You have no memos. </p>
                } 
            </div>
        );
    }
}

export default Dashboard;