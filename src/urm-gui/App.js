
import React from 'react';
import {EditorState} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {basicSetup} from '@codemirror/basic-setup';

import './App.css';
import compile from '../jurm-module/compile.js';
import Interpreter from '../jurm-module/interpreter';
import RegistersComponent from './Registers.js';
import initial_code from '../initial_code.js';

export default class App extends React.Component {
  constructor() {
    super();
    let initial_register = 0;
    this.register_length = 10;
    this.interpreter = new Interpreter();
    let regs = this.interpreter.regs;
    this.state = {
      regs: regs,
      code: initial_code,
      initial_register: initial_register
    };
  }

  runButton() {
    let result_parse = compile(this.state.code);
    if (result_parse.line_error === -1) {
      this.interpreter.load_parse_tree(result_parse.parse_tree);
      this.interpreter.run();
      this.setState({regs: this.interpreter.regs});
    } else {
      console.error(`Error on line ${result_parse.line_error}`);
    }
  }

  setRegisterWithAnimation(r_index, value) {
    let register_is_in_screen = (r_index >= this.state.initial_register) && (r_index < this.register_length);
    if (!register_is_in_screen) {
      this.setState({initial_register: r_index});
    }
    setTimeout(() => {
      let cell = document.getElementById('r_index_' + r_index);
      cell.style.backgroundColor = 'aquamarine'
      setTimeout(() => {
        this.state.regs.set_r(r_index, value);
        this.setState({regs: this.state.regs});
        setTimeout(() => {
          cell.style.backgroundColor = ''
        }, 200);
      }, 200);
    }, 300);
  }

  changeFirstRegister() {
    let form_text = document.getElementById("first_register").value;
    let int_value = parseInt(form_text);
    if (int_value > -1) {
      console.log("Text valid: " + int_value)
      this.setState({
        initial_register: int_value
      })
    } else {
      console.warn("Text invalid: " + form_text)
    }
  }

  componentDidMount() {
    let editor_component = document.getElementById('cm-editor-root');
    let editor_was_not_mount = editor_component.children.length === 0;
    if (editor_was_not_mount) {
      console.log('Mounting editor')
      let defaultThemeOption = EditorView.theme({
        '&': {
          'height': '200px',
          'width': '80%'
        },
      });
      let updateDoc = EditorView.updateListener.of((vu) => {
        if (vu.docChanged) {
          let doc = vu.state.doc;
          let value = doc.toString();
          this.setState({code: value})
        }
      });
      let startState = EditorState.create({
        doc: initial_code,
        extensions: [basicSetup, updateDoc, defaultThemeOption]
      })
      let view = new EditorView({
        state: startState,
        parent: editor_component
      })
    }
  }

  render() {
    return (
      <div className="App">
        <RegistersComponent 
          initial_register={this.state.initial_register} 
          register_length={this.register_length} 
          regs={this.state.regs}
        />
        <div className="first_register_input_div">
          <label htmlFor="first_register">Choose first register to show above: </label>
          <input id="first_register" type="text"></input>
          <button type="button" onClick={() => this.changeFirstRegister()}>Choose!</button> 
        </div>
        <div className="editor-buttons">
          <button type="button" className="editor-button run" onClick={() => this.runButton()}>Run!</button> 
          <button type="button" className="editor-button debuger" onClick={() => console.log('run debugger click')}>Run Debuger!</button> 
        </div>
        <div id="cm-editor-root">
        </div>
      </div>
    );
  }

}
