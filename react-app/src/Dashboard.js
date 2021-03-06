import React, { Component } from 'react';
import Memo from "./DashboardElements/Memo.js"
import { Button } from '@material-ui/core';
import uuid from "./uuid.js"
import api from "./API.js"

class Dashboard extends Component{

    state = {
        memos: []
    }

    componentWillMount = () => {
        api.fetch(api.endpoints.fetchMemos(localStorage.getItem('token')),
        (response) => {
            console.log(response);
            let result = []
            if(response.length > 0)
                response.forEach((memo) => {
                    console.log(memo);
                    api.fetch(api.endpoints.getMemo(localStorage.getItem('token'), memo._id),
                    (res) => {
                        console.log(res);
                        if('content' in res){
                            result.push({
                                id: uuid(),
                                _id: res._id,
                                text: res.content,
                                edit: false,
                                isAdded: true
                            })
                        }
                    })
                }
        )
        console.log(result);
        this.setState({memos: result});
        })
    }

    handleDelete = (id) => {
        const memos = this.state.memos.filter(m => m.id !== id);
        this.setState({memos});
    }

    handleAdd = () => {
        const memos = [{id: uuid(), _id: '', text: '', edit: true, isAdded: false}].concat(this.state.memos);
        this.setState({memos});
    }

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <Button variant="contained" onClick={this.handleAdd} style={{marginTop: 10}} data-cy="add">
                    ADD
                </Button>
                {this.state.memos.length > 0
                ?
                <div>
                    {this.state.memos.map(memo => <Memo
                        key={memo.id}
                        id={memo.id}
                        _id={memo._id}
                        text={memo.text}
                        onDelete={this.handleDelete}
                        edit={memo.edit}
                        isAdded={memo.isAdded}
                        />)}
                </div>
                : <p> You have no memos. </p>
                } 
            </div>
        );
    }
}

export default Dashboard;