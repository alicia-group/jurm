import './App.css';
import Registers from '../jurm-module/registers';
import RegistersComponent from './Registers.js';

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
    </div>
  );
}

export default App;
