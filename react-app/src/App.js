import React, { Component } from 'react';
import { Page, Button, Textarea, Panel } from 'react-blur-admin';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textareaCount: 1
    };
  }

  onTextChange(key, event) {
    this.setState({ [key]: event.currentTarget.value });
  }

  render() {

    return (
      <Page>
        <Button type='add' on/>
        <Panel title={`Textarea No.${this.state.textareaCount}`}>
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
