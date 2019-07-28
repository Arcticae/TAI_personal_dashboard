import React, { Component } from 'react';
import Memo from "./DashboardElements/Memo.js"
import { Button } from '@material-ui/core';
import uuid from "./uuid.js"
import api from "./API.js"

class Dashboard extends Component{

    state = {
        memos: [],
        googleLink: "",
        googleStarted: false,
        googleCode: ""
    }

    componentDidMount = () => {
        api.fetch(api.endpoints.googleGetLink(),
        (response) => {
            console.log(response);
            this.setState({googleLink: response.link});
        })
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

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };
    
    handleDelete = (id) => {
        const memos = this.state.memos.filter(m => m.id !== id);
        this.setState({memos});
    }

    handleAdd = () => {
        const memos = [{id: uuid(), _id: '', text: '', edit: true, isAdded: false}].concat(this.state.memos);
        this.setState({memos});
    }

    googleStart = () => {
        this.setState({googleStarted: true});
        var win = window.open(this.state.googleLink, '_blank');
        win.focus();
    }

    googleConnect = () => {
        api.fetch(api.endpoints.googleAuthorize(localStorage.getItem('token'), {accessCode: this.state.googleCode}),
        (response) => {
            console.log(response);
        })
    }

    render() {
        return (
            <div style={{marginLeft: 10, marginTop: 10}}>
                <Button variant="contained" onClick={this.handleAdd} style={{marginTop: 10}}>
                    ADD
                </Button>
                <div>
                {this.state.googleStarted?
                <div>
                    <input id="googleCode" placeholder="Paste code here" value={this.state.googleCode} onChange={this.handleChange} />
                    <Button variant="contained" onClick={this.googleConnect}>
                        BOOM
                    </Button></div>
                :
                    <Button variant="contained" onClick={this.googleStart}>
                        CONNECT WITH GOOGLE
                    </Button>
                }
                </div>
                
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