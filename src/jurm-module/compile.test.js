
import compile from './compile';
import {Statement, ParseTree} from './parser.js';
import tokens from './tokens.js'
import initial_code from '../initial_code.js'


it('should create parse tree from initial code', () => {
  let result = compile(initial_code);
  expect(result.parse_tree.statements).toStrictEqual([
    new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 2),
    new Statement(tokens.SUC, [tokens.REGISTER_NUMBER, 0], 3),
    new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 1, tokens.REGISTER_NUMBER, 0], 4),
    new Statement(tokens.JUMP, [tokens.REGISTER_NUMBER, 2, tokens.REGISTER_NUMBER, 3, tokens.NATURAL_NUMBER, 9], 5),
    new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 7),
    new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 1], 9),
  ]);
  expect(result.line_error).toStrictEqual(-1);
});

it('should create empty parse tree from code with only spaces', () => {
  let code = `
  
     



  `; 
  let result = compile(code);
  expect(result.parse_tree.statements).toStrictEqual([
  ]);
  expect(result.line_error).toStrictEqual(-1);
});

it('should create parse tree from code with spaces and commands', () => {
  let code = `
  
     
  copy r0 1

    zero r0

  `; 
  let result = compile(code);
  expect(result.parse_tree.statements).toStrictEqual([
    new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 1], 4),
    new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 6),
  ]);
  expect(result.line_error).toStrictEqual(-1);
});

it('should especify line with wrong token', () => {
  let code = `
  
     
  copy r0 1

    zero r0

    xxx

  `; 
  let result = compile(code);
  expect(result.parse_tree).toBeFalsy();
  expect(result.line_error).toStrictEqual(8);
});
