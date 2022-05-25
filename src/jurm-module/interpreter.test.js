
import compile from './compile';
import Interpreter from './interpreter'

it('should interpreter load value in register statement', () => {
  let interpreter = new Interpreter();
  let result = compile('copy r0 10');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
});

it('should interpreter load register in another register statement', () => {
  let interpreter = new Interpreter();
  interpreter.regs.set_r(1, 10)
  let result = compile('copy r0 r1');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
  expect(interpreter.regs.get_r(1)).toStrictEqual(10);
});

it('should interpreter clear statement', () => {
  let interpreter = new Interpreter();
  interpreter.reset_registers(10)
  let result = compile('zero r0');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(0);
  expect(interpreter.regs.get_r(1)).toStrictEqual(10);
});

it('should interpreter jump statement(false comparison)', () => {
  let interpreter = new Interpreter();
  let result = compile(`
  copy r0 0
  jp r0 4
  copy r5 5
  copy r6 6
  `);
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(0);
  expect(interpreter.regs.get_r(5)).toStrictEqual(5);
  expect(interpreter.regs.get_r(6)).toStrictEqual(6);
});

it('should interpreter jump statement(true comparison)', () => {
  let interpreter = new Interpreter();
  let result = compile(`
  copy r0 10
  jp r0 4
  copy r5 5
  copy r6 6
  `);
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
  expect(interpreter.regs.get_r(5)).toStrictEqual(0);
  expect(interpreter.regs.get_r(6)).toStrictEqual(6);
});

it('should interpreter jump statement with new lines(false comparison)', () => {
  let interpreter = new Interpreter();
  let result = compile(`

  copy r0 0

  jp r0 7

  copy r5 5


  copy r6 6
  `);
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(0);
  expect(interpreter.regs.get_r(5)).toStrictEqual(5);
  expect(interpreter.regs.get_r(6)).toStrictEqual(6);
});

it('should interpreter jump statement with new lines(true comparison)', () => {
  let interpreter = new Interpreter();
  let result = compile(`

  copy r0 10

  jp r0 7

  copy r5 5


  copy r6 6
  `);
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
  expect(interpreter.regs.get_r(5)).toStrictEqual(0);
  expect(interpreter.regs.get_r(6)).toStrictEqual(6);
});
