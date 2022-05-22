
import compile from './compile';
import tokens from './tokens.js'
import Registers from './registers.js'

export default class Interpreter {
  constructor() {
    this.regs = new Registers(0);
    this.parse_tree = null;
    this.PC = 0;
  }

  load_parse_tree(parse_tree) {
    this.parse_tree = parse_tree;
  }

  reset_registers(default_value) {
    this.regs = new Registers(default_value);
  }

  get_next_statement() {
    let statement = this.parse_tree.statements[this.PC];
    this.PC += 1;
    if (this.PC >= this.parse_tree.statements.length) {
      this.PC = -1;
    }
    return statement;
  }

  execute_load_statement(statement) {
    let value;
    let r_number = statement.statement_args[1];
    if (statement.statement_args[2] === tokens.NATURAL_NUMBER) {
      value = statement.statement_args[3];
    } else {
      value = this.regs.get_r(statement.statement_args[3]);
    }
    this.regs.set_r(r_number, value);
  }

  execute_clear_statement(statement) {
    let r_number = statement.statement_args[1];
    this.regs.set_r(r_number, 0);
  }

  run() {
    let next_command;
    while (this.PC >= 0) {
      next_command = this.get_next_statement();
      if (next_command.name === tokens.LOAD) {
        this.execute_load_statement(next_command);
        continue;
      }
      if (next_command.name === tokens.CLEAR) {
        this.execute_clear_statement(next_command);
        continue;
      }
    }
  }

}