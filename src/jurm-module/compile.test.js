
import compile from './compile';
import {Statement, ParseTree} from './parser.js';
import tokens from './tokens.js'
import initial_code from '../initial_code.js'


it('should create parse tree from initial code', () => {
  let result = compile(initial_code);
  expect(result.parse_tree.statements).toStrictEqual([
    new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]),
    new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 1, tokens.REGISTER_NUMBER, 0]),
    new Statement(tokens.JUMP, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 5]),
    new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 1]),
    new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]),
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
  
     
  ld r0 1

    clear r0

  `; 
  let result = compile(code);
  expect(result.parse_tree.statements).toStrictEqual([
    new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 1]),
    new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]),
  ]);
  expect(result.line_error).toStrictEqual(-1);
});

it('should especify line with wrong token', () => {
  let code = `
  
     
  ld r0 1

    clear r0

    xxx

  `; 
  let result = compile(code);
  expect(result.parse_tree).toBeFalsy();
  expect(result.line_error).toStrictEqual(7);
});
