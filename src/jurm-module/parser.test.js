
import parser from './parser.js';
import {Statement, ParseTree} from './parser.js';

import tokens from './tokens.js';


it('should parser clear statement', () => {
  let result = parser([tokens.ZERO, tokens.REGISTER_NUMBER, 0]); // clear r0
  let clear_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 0);
  expect(result.statements).toStrictEqual([clear_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement with end line', () => {
  let result = parser([tokens.ZERO, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE]); // clear r0
  let clear_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 0);
  expect(result.statements).toStrictEqual([clear_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong clear statement', () => {
  let result = parser([tokens.ZERO, tokens.NATURAL_NUMBER, 0]);
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser successor statement', () => {
  let result = parser([tokens.SUC, tokens.REGISTER_NUMBER, 1]); // suc r1
  let statement_expected = new Statement(tokens.SUC, [tokens.REGISTER_NUMBER, 1], 0);
  expect(result.statements).toStrictEqual([statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser successor and zero statement', () => {
  let result = parser([
    tokens.NEW_LINE,
    tokens.SUC, tokens.REGISTER_NUMBER, 1, tokens.NEW_LINE,  // suc r1
    tokens.ZERO, tokens.REGISTER_NUMBER, 10]);               // zero r10
  let suc_statement_expected = new Statement(tokens.SUC, [tokens.REGISTER_NUMBER, 1], 1);
  let zero_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 10], 2);
  expect(result.statements).toStrictEqual([suc_statement_expected, zero_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong successor statement', () => {
  let result = parser([tokens.SUC, tokens.NATURAL_NUMBER, 1]);
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser load number in register statement', () => {
  let result = parser([tokens.COPY, tokens.REGISTER_NUMBER, 5, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE]); // ld r5 10 
  let ld_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 5, tokens.NATURAL_NUMBER, 10], 0);
  expect(result.statements).toStrictEqual([ld_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser load register in another register statement', () => {
  let result = parser([tokens.COPY, tokens.REGISTER_NUMBER, 5, tokens.REGISTER_NUMBER, 10, tokens.NEW_LINE]); // ld r5 r10
  let ld_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 5, tokens.REGISTER_NUMBER, 10], 0);
  expect(result.statements).toStrictEqual([ld_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong load statement', () => {
  let result = parser([tokens.COPY, tokens.NATURAL_NUMBER, 5, tokens.REGISTER_NUMBER, 10, tokens.NEW_LINE]);
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
  result = parser([tokens.COPY, tokens.NEW_LINE])
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
  result = parser([tokens.COPY, tokens.JUMP, tokens.NEW_LINE])
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser jump statement', () => {
  let result = parser([tokens.JUMP, tokens.REGISTER_NUMBER, 1, tokens.NATURAL_NUMBER, 100, tokens.NEW_LINE]); // jp r1 100
  let jp_statement_expected = new Statement(tokens.JUMP, [tokens.REGISTER_NUMBER, 1, tokens.NATURAL_NUMBER, 100], 0);
  expect(result.statements).toStrictEqual([jp_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on wrong jump statement', () => {
  let result = parser([tokens.JUMP, tokens.REGISTER_NUMBER, 1, tokens.REGISTER_NUMBER, 100, tokens.NEW_LINE]); // wrong statement
  expect(result.statements).toStrictEqual([]);
  expect(result.line_with_parser_error).toStrictEqual(0);
});

it('should parser clear statement and load statement', () => {
  let result = parser([
    tokens.ZERO, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE,                                 // clear r0
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10                         // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 0);
  let load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 1);
  expect(result.statements).toStrictEqual([clear_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement and load statement with extra new lines', () => {
  let result = parser([
    tokens.ZERO, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE,                                // clear r0
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE       // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 0);
  let load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 3);
  expect(result.statements).toStrictEqual([clear_statement_expected, load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should parser clear statement and two load statement with extra new lines', () => {
  let result = parser([
    tokens.ZERO, tokens.REGISTER_NUMBER, 0, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE,                                // clear r0
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE,                       // ld r0 10
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, tokens.NEW_LINE, tokens.NEW_LINE       // ld r0 10
  ]);
  let clear_statement_expected = new Statement(tokens.ZERO, [tokens.REGISTER_NUMBER, 0], 0);
  let first_load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 3);
  let second_load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 5);
  expect(result.statements).toStrictEqual([clear_statement_expected, first_load_statement_expected, second_load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(-1);
});

it('should fail on third wrong statement before two load statement', () => {
  let result = parser([
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE,    // ld r0 10
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE,    // ld r0 10
    tokens.COPY, tokens.NEW_LINE, tokens.JUMP // wrong statement
  ]);
  let first_load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 0);
  let second_load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 1);
  expect(result.statements).toStrictEqual([first_load_statement_expected, second_load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(2);
});

it('should fail on wrong statement after new lines', () => {
  let result = parser([
    tokens.NEW_LINE,
    tokens.NEW_LINE,
    tokens.COPY, tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10, tokens.NEW_LINE, // ld r0 10
    tokens.COPY, tokens.NEW_LINE, tokens.JUMP // wrong statement
  ]);
  let load_statement_expected = new Statement(tokens.COPY, [tokens.REGISTER_NUMBER, 0, tokens.NATURAL_NUMBER, 10], 2);
  expect(result.statements).toStrictEqual([load_statement_expected]);
  expect(result.line_with_parser_error).toStrictEqual(3);
});

