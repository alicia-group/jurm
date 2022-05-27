
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
    this.PC = 0;
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

  execute_jump_statement(statement) {
    let r1_number = statement.statement_args[1];
    let r2_number = statement.statement_args[3];
    let r1_value = this.regs.get_r(r1_number);
    let r2_value = this.regs.get_r(r2_number);
    if (r1_value === r2_value) {
      let jump_value = statement.statement_args[5];
      let next_statement;
      for (let statement_index = 0; statement_index < this.parse_tree.statements.length; statement_index++) {
        next_statement = this.parse_tree.statements[statement_index];
        if (jump_value <= next_statement.line_number) {
          this.PC = statement_index;
          return;
        }
      }
      console.error('Jump value out of range!');
      this.PC = -1;
    } 
  }

  execute_suc_statement(statement) {
    let r_number = statement.statement_args[1];
    let value = this.regs.get_r(r_number);
    this.regs.set_r(r_number, value + 1);
  }

  execute_statement(statement) {
    if (statement.name === tokens.COPY) {
      this.execute_load_statement(statement);
      return;
    }
    if (statement.name === tokens.ZERO) {
      this.execute_clear_statement(statement);
      return;
    }
    if (statement.name === tokens.JUMP) {
      this.execute_jump_statement(statement);
      return;
    }
    if (statement.name === tokens.SUC) {
      this.execute_suc_statement(statement);
      return;
    }
  }

  run() {
    let next_command;
    while (this.PC >= 0) {
      next_command = this.get_next_statement();
      this.execute_statement(next_command);
    }
  }

}