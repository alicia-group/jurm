
import compile from './compile';
import Interpreter from './interpreter'

it('should interpreter load value in register statement', () => {
  let interpreter = new Interpreter();
  let result = compile('ld r0 10');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
});

it('should interpreter load register in another register statement', () => {
  let interpreter = new Interpreter();
  interpreter.regs.set_r(1, 10)
  let result = compile('ld r0 r1');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(10);
  expect(interpreter.regs.get_r(1)).toStrictEqual(10);
});

it('should interpreter clear statement', () => {
  let interpreter = new Interpreter();
  interpreter.reset_registers(10)
  let result = compile('clear r0');
  interpreter.load_parse_tree(result.parse_tree);
  interpreter.run();
  expect(interpreter.regs.get_r(0)).toStrictEqual(0);
  expect(interpreter.regs.get_r(1)).toStrictEqual(10);
});

