import React, { Component } from 'react';
import { Button } from 'react-blur-admin';

class AddButton extends Button{
    constructor(props) {
        super(props);
        this.props = {
            type: 'add'
        }
    }

    render(){
        return(
            <Button type='add' />
        )
    }
}

module.exports = {
    AddButton
}