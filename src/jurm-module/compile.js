
import lexer from './lexer.js';
import parse from './parser.js';
import tokens from './tokens.js';

class CompileResult {
  constructor(parse_tree, line_error) {
    this.parse_tree = parse_tree;
    this.line_error = line_error;
  }
}

export default function compile(code) {
  let tokenizing_result = lexer(code);
  if (tokenizing_result.unregonized_line >= 0) {
    return new CompileResult(null, tokenizing_result.unregonized_line);
  } else {
    let parser_result = parse(tokenizing_result.tokens);
    return new CompileResult(parser_result, parser_result.line_with_parser_error);
  }
}

