
import tokens from './tokens.js'

function analyzer_jump_statement(jump, tree) {
  let jump_value = jump.statement_args[5];
  for (let statement of tree.statements) {
    if (statement.line_number === jump_value) {
      return -1;
    }
  }
  return jump.line_number;
}

export default function analyzer(tree) {
  let line_with_error = -1;
  if (tree.line_with_parser_error != -1) {
    line_with_error = tree.line_with_parser_error;
  } else {
    for (let statement of tree.statements) {
      if (statement.name === tokens.JUMP) {
        line_with_error = analyzer_jump_statement(statement, tree);
        if (line_with_error != -1) {
          break;
        }
      }
    }
  }
  return line_with_error;
}