import lexer from './lexer.js';
import parse from './parser.js';
import analyzer from './semantic_analyzer.js';
import tokens from './tokens.js';


it('analizer should pass on correct jump argument', () => {
  let result = parse(lexer('zero r0\n jump r1 r10 1').tokens);
  let line_with_error = analyzer(result)
  expect(line_with_error).toStrictEqual(-1);
});

it('analyzer shoud return error on parser ', () => {
  let result = parse(lexer('zero 0\n jump r1 r10 1').tokens);
  let line_with_error = analyzer(result)
  expect(line_with_error).toStrictEqual(1);
});

it('analyzer shoud return error on wrong jump argument', () => {
  let result = parse(lexer('zero r0\n jump r1 r10 100').tokens);
  let line_with_semantic_error = analyzer(result)
  expect(result.line_with_parser_error).toStrictEqual(-1);
  expect(line_with_semantic_error).toStrictEqual(2);
});
