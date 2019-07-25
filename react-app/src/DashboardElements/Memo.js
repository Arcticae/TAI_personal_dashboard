import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import { Button, TextField } from '@material-ui/core';
import './memo.css'

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
        text: this.props.text,
        edit: this.props.edit,
        confirmDelete: false
    };

    handleEdit = () => {
        this.setState({edit: true});
    }

    handleSave = () => {
        // todo post
        this.setState({edit: false});
    }

    handleDelete = () => {this.setState({confirmDelete: true});}
    handleCancelDelete = () => {this.setState({confirmDelete: false});}
    handleConfirmDelete = () => {console.log(this.props.id); this.props.onDelete(this.props.id);}

    handleChange = event => {
        this.setState({text: event.currentTarget.value})
    }

    render() {
        const {classes} = this.props;
        const {text, edit, confirmDelete} = this.state;

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
                    
                    <TextField multiline
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