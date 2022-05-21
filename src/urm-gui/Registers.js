
import React from 'react';
import './Registers.css';

class RegistersComponent extends React.Component {
  render() {
    let headers = [];
    let cells = [];
    for (let index = this.props.initial_register; index < (this.props.initial_register + this.props.register_length); index++) {
      headers.push(<th className="cells_header" id={"r_header_index_" + index} key={index.toString()}>{"r" + index}</th>);
      cells.push(<td className="cells" id={"r_index_" + index} key={index.toString()}>{this.props.regs.get_r(index)}</td>);
    }
    return (
      <div>
        <table className="registers_table">
          <tbody>
            <tr>
              {headers}
            </tr>
            <tr>
              {cells}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default RegistersComponent;
