import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import { Button, TextField } from '@material-ui/core';
import './memo.css'
import api from '../API.js'

const styles = (theme) => ({
    memo: {
        marginLeft: 10,
        marginTop: 20
    },
    saveRow: {
        display: 'flex',
        alignItems: 'center'
    },
    disab: {
        color: 'black'
    },
    editmemo: {
        width: '33%'
    }
});

class Memo extends Component {
    state = {
        id: this.props.id,  // internal ID, for React and header
        _id: this.props._id,            // ID from server
        text: this.props.text,
        edit: this.props.edit,
        confirmDelete: false,
        isAdded: this.props.isAdded
    };

    handleEdit = () => {
        this.setState({edit: true});
    }

    handleSave = () => {
        if(!this.state.isAdded){
            api.fetch(
                api.endpoints.addMemo(localStorage.getItem('token'), {
                    content: this.state.text,
                    header: this.state.id   // designed it differently, so I am passing memo's ID
                }),
                (response) => {
                    console.log(response);
                    if('_id' in response){
                        console.log(response._id);
                        this.setState({_id: response._id});
                    }
                }
            )
        }
        this.setState({edit: false, isAdded: true}); // there is no put method :(
    }

    handleDelete = () => {this.setState({confirmDelete: true});}
    handleCancelDelete = () => {this.setState({confirmDelete: false});}
    handleConfirmDelete = () => {
        const {_id, isAdded} = this.state;
        if(isAdded){
            api.fetchNoContent(
                api.endpoints.deleteMemo(localStorage.getItem('token'), _id))
        }
        this.props.onDelete(this.props.id);
    }

    handleChange = event => {
        this.setState({text: event.currentTarget.value})
    }

    render() {
        const {classes} = this.props;
        const {text, edit, confirmDelete, isAdded} = this.state;

        return (
            <div className={classes.memo}>
                {edit
                ?
                <div>
                    {confirmDelete
                    ?
                    <div className={classes.saveRow}>
                        <Button disabled size="small" variant="outlined">
                            SAVE
                        </Button>
                        <Button size="small" color="secondary">
                            DELETE?
                        </Button>
                        <Button size="small" color="secondary"  variant="outlined" onClick={this.handleConfirmDelete}>
                            CONFIRM
                        </Button>
                        <Button size="small"  variant="outlined" onClick={this.handleCancelDelete}>
                            CANCEL
                        </Button>
                    </div>
                    :
                    <div className={classes.saveRow}>
                        <Button size="small" color="primary" variant="outlined" onClick={this.handleSave}>
                            SAVE
                        </Button>
                        <Button size="small" color="secondary" variant="outlined" onClick={this.handleDelete}>
                            DELETE
                        </Button>
                    </div>
                    }
                    
                    <TextField multiline disabled={isAdded}
                        className={classes.editmemo}
                        rowsMax="10"
                        value={text}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                    />
                </div>
                :
                <div>
                    <Button size="small" color="primary" variant="outlined" onClick={this.handleEdit}>
                        EDIT
                    </Button><br />
                    <TextField multiline disabled
                        className={"frozenmemo"}
                        rowsMax="10"
                        value={text}
                        margin="normal"
                        variant="outlined"
                    />
                </div>
            }
            </div>
        );
    }
}

export default withStyles(styles)(Memo);