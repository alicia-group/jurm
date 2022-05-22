
import tokens from './tokens.js'

class Statement {
  constructor(name, args) {
    this.name = name;
    this.statement_args = args;
  }
}

class ParseTree {
  constructor() {
    this.statements = [];
    this.line_with_parser_error = -1;
  }
}

export default function parse(tokens_input) {
  tokens_input.push(tokens.NEW_LINE) // forcing all statements to end with new line
  let parse_tree = new ParseTree();
  let next_token;
  let correct_statement;
  let current_line = 0;
  for (let next_token_index = 0; next_token_index < tokens_input.length;) {
    next_token = tokens_input[next_token_index];
    if (next_token === tokens.CLEAR) {
      correct_statement = (
        (tokens_input[next_token_index + 1] === tokens.REGISTER_NUMBER) && 
        (tokens_input[next_token_index + 2] > -1) &&
        (tokens_input[next_token_index + 3] === tokens.NEW_LINE)
      );
      if (correct_statement) {
        parse_tree.statements.push(new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, tokens_input[next_token_index + 2]]));
        next_token_index += 4;
        current_line++;
        continue;
      } else {
        parse_tree.line_with_parser_error = current_line;
        return parse_tree;
      }
    }
    if (next_token === tokens.LOAD) {
      correct_statement = (
        (tokens_input[next_token_index + 1] === tokens.REGISTER_NUMBER) && 
        (tokens_input[next_token_index + 2] > -1) &&
        ((tokens_input[next_token_index + 3] === tokens.NATURAL_NUMBER) || (tokens_input[next_token_index + 3] === tokens.REGISTER_NUMBER)) &&
        (tokens_input[next_token_index + 4] > -1) &&
        (tokens_input[next_token_index + 5] === tokens.NEW_LINE)
      );
      if (correct_statement) {
        parse_tree.statements.push(new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, tokens_input[next_token_index + 2], tokens_input[next_token_index + 3], tokens_input[next_token_index + 4]]));
        next_token_index += 6;
        current_line++;
        continue;
      } else {
        parse_tree.line_with_parser_error = current_line;
        return parse_tree;
      }
    }
    if (next_token == tokens.NEW_LINE) {
      next_token_index++;
      current_line++;
      continue;
    }
    else {
      parse_tree.line_with_parser_error = current_line;
      return parse_tree;
    }
  }
  return parse_tree;
}

export {
  Statement,
  ParseTree
};
