
import lexer from './lexer.js';
import tokens from './tokens.js';


it('should tokenize clear', () => {
  let tokens_result = lexer('clear');
  expect(tokens_result).toStrictEqual([tokens.CLEAR]);
  tokens_result = lexer('clear\n');
  expect(tokens_result).toStrictEqual([tokens.CLEAR, tokens.NEW_LINE]);
  tokens_result = lexer('  clear \n\n');
  expect(tokens_result).toStrictEqual([tokens.CLEAR, tokens.NEW_LINE, tokens.NEW_LINE]);
});

it('should tokenize natural numbers', () => {
  let tokens_result = lexer('1234');
  expect(tokens_result).toStrictEqual([tokens.NATURAL_NUMBER, 1234]);
  tokens_result = lexer('1234a');
  expect(tokens_result).toStrictEqual([]);
});

it('should tokenize register indexes', () => {
  let tokens_result = lexer('r1234');
  expect(tokens_result).toStrictEqual([tokens.REGISTER_NUMBER, 1234]);
  tokens_result = lexer('r1234a');
  expect(tokens_result).toStrictEqual([]);
});