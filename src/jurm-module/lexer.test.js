
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

it('should tokenize a complete jump statement', () => {
  let result = lexer('jp r02 10\n');
  expect(result.tokens).toStrictEqual([tokens.JUMP, tokens.REGISTER_NUMBER, 2, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(-1);
});

it('should set unregonized line', () => {
  let result = lexer('fooba\n');
  expect(result.tokens).toStrictEqual([]);
  expect(result.unregonized_line).toStrictEqual(0);
  result = lexer('ld fooba\n');
  expect(result.tokens).toStrictEqual([tokens.LOAD]);
  expect(result.unregonized_line).toStrictEqual(0);
  result = lexer('ld \n ld aaa \n');
  expect(result.tokens).toStrictEqual([tokens.LOAD, tokens.NEW_LINE, tokens.LOAD]);
  expect(result.unregonized_line).toStrictEqual(1);
});

it('should tokenize a complete load statement and set unregonized line', () => {
  let result = lexer('ld r0 100  \naaa');
  expect(result.tokens).toStrictEqual([tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(1);
  result = lexer('ld r0 100  \n \naaa \n ld');
  expect(result.tokens).toStrictEqual([tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(2);
});
