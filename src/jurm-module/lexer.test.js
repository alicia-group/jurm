
import lexer from './lexer.js';
import tokens from './tokens.js';


it('should tokenize clear', () => {
  let result = lexer('zero');
  expect(result.tokens).toStrictEqual([tokens.ZERO]);
  result = lexer('zero\n');
  expect(result.tokens).toStrictEqual([tokens.ZERO, tokens.NEW_LINE]);
  result = lexer('  zero \n\n');
  expect(result.tokens).toStrictEqual([tokens.ZERO, tokens.NEW_LINE, tokens.NEW_LINE]);
});

it('should tokenize natural numbers', () => {
  let result = lexer('1234');
  expect(result.tokens).toStrictEqual([tokens.NATURAL_NUMBER, 1234]);
  result = lexer('1234a');
  expect(result.tokens).toStrictEqual([]);
});

it('should tokenize successor', () => {
  let result = lexer('suc');
  expect(result.tokens).toStrictEqual([tokens.SUC]);
});

it('should tokenize register indexes', () => {
  let result = lexer('r1234');
  expect(result.tokens).toStrictEqual([tokens.REGISTER_NUMBER, 1234]);
  result = lexer('r1234a');
  expect(result.tokens).toStrictEqual([]);
});

it('should tokenize a complete load statement', () => {
  let result = lexer('copy r0 100\n');
  expect(result.tokens).toStrictEqual([tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE]);
});

it('should tokenize a complete jump statement', () => {
  let result = lexer('jump r02 10\n');
  expect(result.tokens).toStrictEqual([tokens.JUMP, tokens.REGISTER_NUMBER, 2, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(-1);
});

it('should set unregonized line', () => {
  let result = lexer('fooba\n');
  expect(result.tokens).toStrictEqual([]);
  expect(result.unregonized_line).toStrictEqual(0);
  result = lexer('copy fooba\n');
  expect(result.tokens).toStrictEqual([tokens.COPY]);
  expect(result.unregonized_line).toStrictEqual(0);
  result = lexer('copy \n copy aaa \n');
  expect(result.tokens).toStrictEqual([tokens.COPY, tokens.NEW_LINE, tokens.COPY]);
  expect(result.unregonized_line).toStrictEqual(1);
});

it('should tokenize a complete load statement and set unregonized line', () => {
  let result = lexer('copy r0 100  \naaa');
  expect(result.tokens).toStrictEqual([tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(1);
  result = lexer('copy r0 100  \n \naaa \n copy');
  expect(result.tokens).toStrictEqual([tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE, tokens.NEW_LINE]);
  expect(result.unregonized_line).toStrictEqual(2);
});
