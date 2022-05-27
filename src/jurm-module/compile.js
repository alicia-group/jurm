
import lexer from './lexer.js';
import parse from './parser.js';
import analyzer from './semantic_analyzer.js';
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
    let line_with_sintatic_or_semantic_error = analyzer(parser_result);
    return new CompileResult(parser_result, line_with_sintatic_or_semantic_error);
  }
}

