
import parser from './parser.js';
import {Statement, ParseTree} from './parser.js';

import tokens from './tokens.js';


it('should parser clear statement', () => {
  let result = parser([tokens.CLEAR, tokens.REGISTER_NUMBER, 0]); // clear r0
  let clear_statement_expected = new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]);
  expect(result.statements).toStrictEqual([clear_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement with end line', () => {
  let result = parser([tokens.CLEAR, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE]); // clear r0
  let clear_statement_expected = new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]);
  expect(result.statements).toStrictEqual([clear_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong clear statement', () => {
  let result = parser([tokens.CLEAR, tokens.NATURAL_NUMBER, 0]);
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser load number in register statement', () => {
  let result = parser([tokens.LOAD, tokens.REGISTER_NUMBER, 5, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE]); // ld r5 10
  let ld_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 5, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([ld_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser load register in another register statement', () => {
  let result = parser([tokens.LOAD, tokens.REGISTER_NUMBER, 5, tokens.REGISTER_NUMBER, 10, tokens.NEW_LINE]); // ld r5 r10
  let ld_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 5, tokens.REGISTER_NUMBER, 10]);
  expect(result.statements).toStrictEqual([ld_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong load statement', () => {
  let result = parser([tokens.LOAD, tokens.NATURAL_NUMBER, 5, tokens.REGISTER_NUMBER, 10, tokens.NEW_LINE]);
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
  result = parser([tokens.LOAD, tokens.NEW_LINE])
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
  result = parser([tokens.LOAD, tokens.JUMP, tokens.NEW_LINE])
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser clear statement and load statement', () => {
  let result = parser([
    tokens.CLEAR, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE,                                 // clear r0
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10                         // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]);
  let load_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([clear_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement and load statement with extra new lines', () => {
  let result = parser([
    tokens.CLEAR, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE,                                // clear r0
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE       // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]);
  let load_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([clear_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement and two load statement with extra new lines', () => {
  let result = parser([
    tokens.CLEAR, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE,                                // clear r0
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE,                       // ld r0 10
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE       // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.CLEAR, [tokens.REGISTER_NUMBER, 0]);
  let load_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([clear_statement_expected, load_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on third wrong statement before two load statement', () => {
  let result = parser([
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE,    // ld r0 10
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE,    // ld r0 10
    tokens.LOAD, tokens.NEW_LINE, tokens.JUMP // wrong statement
  ]);
  let load_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([load_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(2);
});

it('should fail on wrong statement after new lines', () => {
  let result = parser([
    tokens.NEW_LINE,
    tokens.NEW_LINE,
    tokens.LOAD, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, // ld r0 10
    tokens.LOAD, tokens.NEW_LINE, tokens.JUMP // wrong statement
  ]);
  let load_statement_expected = new Statement(tokens.LOAD, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10]);
  expect(result.statements).toStrictEqual([load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(3);
});

