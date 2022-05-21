
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

import './App.css';
import Registers from '../jurm-module/registers';
import RegistersComponent from './Registers.js';
import initial_code from '../initial_code.js';

export default class App extends React.Component {
  constructor() {
    super();
    let initial_register = 0;
    this.register_length = 10;
    let regs = new Registers(0);
    regs.set_r(0, 1);
    regs.set_r(4, 3);
    regs.set_r(5, 10);
    regs.set_r(1002, 3);
    regs.set_r(1001, 666);
    regs.set_r(1003, 6666666);
    this.state = {
      regs: regs,
      code: initial_code,
      initial_register: initial_register
    };
  }

  runButton() {
    console.log(this.state.code);
    this.setRegisterWithAnimation(4, 11);
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
        <CodeMirror
          value={initial_code}
          height="200px"
          width="80%"
          onChange={(value, viewUpdate) => {
            this.setState({code: value});
          }}
        />
        <button type="button" onClick={() => this.runButton()}>Run!</button> 
      </div>
    );
  }

}
