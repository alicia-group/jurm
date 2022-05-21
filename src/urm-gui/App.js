
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

import './App.css';
import Registers from '../jurm-module/registers';
import RegistersComponent from './Registers.js';
import initial_code from '../initial_code.js';

export default class App extends React.Component {
  constructor() {
    super();
    console.log(initial_code)
    let regs = new Registers(0);
    regs.set_r(0, 1);
    regs.set_r(4, 3);
    regs.set_r(5, 10);
    regs.set_r(1002, 3);
    regs.set_r(1001, 666);
    regs.set_r(1003, 6666666);
    this.state = {
      regs: regs
    };
  }

  render() {
    return (
      <div className="App">
        <RegistersComponent initial_register={0} register_length={10} regs={this.state.regs}/>
        <CodeMirror
          value={initial_code}
          height="200px"
          width="80%"
          onChange={(value, viewUpdate) => {
            console.log('value:', value);
          }}
        />
      </div>
    );
  }

}
