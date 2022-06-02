
import React from 'react';

import './App.css';
import compile from '../jurm-module/compile.js';
import Interpreter from '../jurm-module/interpreter';
import RegistersComponent from './Registers.js';
import Editor from './Editor.js';
import initial_code from '../initial_code.js';

export default class App extends React.Component {
  constructor() {
    super();
    let initial_register = 0;
    this.register_length = 10;
    this.interpreter = new Interpreter();
    this.editor_ref = null;
    this.line_with_error = -1;
    let regs = this.interpreter.regs;
    this.state = {
      regs: regs,
      initial_register: initial_register
    };
  }

  runButton() {
    console.log(this.editor_ref)
    let result_parse = compile(this.editor_ref.state.code);
    if (result_parse.line_error === -1) {
      this.interpreter.load_parse_tree(result_parse.parse_tree);
      this.interpreter.run();
      this.line_with_error = -1;
      this.editor_ref.setErrorLine(this.line_with_error);
      this.setState({regs: this.interpreter.regs});
    } else {
      console.error(`Error on line ${result_parse.line_error}`);
      this.line_with_error = result_parse.line_error;
      this.editor_ref.setErrorLine(this.line_with_error);
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

  inputValuesOfRegisters() {
    let form_text = document.getElementById("first_values").value;
    let text_items = form_text.split(' ').filter(i => i !== '');
    let values = text_items.map(i => parseInt(i));
    if (values.includes(NaN)) {
      console.warn('Error when reading input values');
    } else {
      for (let i = 0; i < values.length; i++) {
        this.state.regs.set_r(i, values[i]);
      }
      this.setState({regs: this.state.regs});
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
        <div className="register_inputs">
          <div className="first_register_input_div">
            <label htmlFor="first_register">Choose first register to show above: </label>
            <input id="first_register" type="text"></input>
            <button type="button" onClick={() => this.changeFirstRegister()}>Choose!</button> 
          </div>
          <div className="first_values_input_div">
            <label htmlFor="first_values">Insert the first values in the registers: </label>
            <input id="first_values" type="text"></input>
            <button type="button" onClick={() => this.inputValuesOfRegisters()}>Load!</button> 
          </div>
        </div>
        <div className="editor-buttons">
          <button type="button" className="editor-button run" onClick={() => this.runButton()}>Run!</button> 
          <button type="button" className="editor-button debuger" onClick={() => console.log('run debugger click')}>Run Debuger!</button> 
        </div>
        <Editor
          ref={editor_ref => this.editor_ref = editor_ref}
        />
      </div>
    );
  }

}
