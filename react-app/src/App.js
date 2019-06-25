import React, { Component } from 'react';
import { Page, Button, Textarea, Panel } from 'react-blur-admin';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textareaCount: 1,
      nodeRes: ""
    };
    
  }

  componentWillMount() {
    fetch("http://localhost:6969/")
      .then(res => res.text())
      .then(res => this.setState({nodeRes: res}));
  }

  onTextChange(key, event) {
    this.setState({ [key]: event.currentTarget.value });
  }

  addTextField(){
    const number = this.state.textareaCount;

  }

  render() {

    return (
      <Page>
        <Panel value={this.state.nodeRes}>{this.state.nodeRes}</Panel>
        <Button type='add' />
        <Panel title={`Textarea #${this.state.textareaCount}`}>
          <Textarea
            name='textarea'
            placeholder='Default Input'
            label={<Button type='remove' />}
            onChange={e => this.onTextChange('textarea', e)}
            value={this.state.textarea} />
        </Panel>
      </Page>
    );
  }
}

export default App;
