import CodeMirror from '@uiw/react-codemirror';

import './App.css';
import Registers from '../jurm-module/registers';
import RegistersComponent from './Registers.js';

const example_code = `
cp pos_i pos_end
ld pos value
clear pos
jp pos_to_compare line_number    
`;

function App() {
  let regs = new Registers(0);
  regs.set_r(0, 1)
  regs.set_r(4, 3)
  regs.set_r(5, 10)
  regs.set_r(1002, 3)
  regs.set_r(1001, 666)
  regs.set_r(1003, 6666666)
  return (
    <div className="App">
      <RegistersComponent initial_register={0} register_length={10} regs={regs}/>
      <CodeMirror
        value={example_code}
        height="200px"
        width="80%"
        onChange={(value, viewUpdate) => {
          console.log('value:', value);
        }}
      />
    </div>
  );
}

export default App;
