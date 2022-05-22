
import lexer from './lexer.js';
import tokens from './tokens.js';


it('should tokenize clear', () => {
  let result = lexer('clear');
  expect(result.tokens).toStrictEqual([tokens.CLEAR]);
  result = lexer('clear\n');
  expect(result.tokens).toStrictEqual([tokens.CLEAR, tokens.NEW_LINE]);
  result = lexer('  clear \n\n');
  expect(result.tokens).toStrictEqual([tokens.CLEAR, tokens.NEW_LINE, tokens.NEW_LINE]);
});

it('should tokenize natural numbers', () => {
  let result = lexer('1234');
  expect(result.tokens).toStrictEqual([tokens.NATURAL_NUMBER, 1234]);
  result = lexer('1234a');
  expect(result.tokens).toStrictEqual([]);
});

it('should tokenize register indexes', () => {
  let result = lexer('r1234');
  expect(result.tokens).toStrictEqual([tokens.REGISTER_NUMBER, 1234]);
  result = lexer('r1234a');
  expect(result.tokens).toStrictEqual([]);
});

it('should tokenize a complete load statement', () => {
  let result = lexer('ld r0 100\n');
  expect(result.tokens).toStrictEqual([tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE]);
});