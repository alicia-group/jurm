
import React from 'react';

class RegistersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.register_length = props.register_length;
    this.state = {
      regs: props.regs,
      initial_register: props.initial_register
    };
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
    let headers = [];
    let cells = [];
    for (let index = this.state.initial_register; index < (this.state.initial_register + this.register_length); index++) {
      headers.push(<th className="cells_header" id={"r_header_index_" + index} key={index.toString()}>{"r" + index}</th>);
      cells.push(<td className="cells" id={"r_index_" + index} key={index.toString()}>{this.state.regs.get_r(index)}</td>);
    }
    return (
      <div>
        <table>
          <tbody>
            <tr>
              {headers}
            </tr>
            <tr>
              {cells}
            </tr>
          </tbody>
        </table>
        <div>
          <label htmlFor="first_register">Choose first register to show above: </label>
          <input id="first_register" type="text"></input>
          <button type="button" onClick={() => this.changeFirstRegister()}>Choose!</button> 
        </div>
      </div>
    )
  }
}

export default RegistersComponent;
