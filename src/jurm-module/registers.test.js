
import Registers from './registers';

it('get/set in r0', () => {
  let regs = new Registers(0);
  regs.set_r(0, 10);
  expect(regs.get_r(0)).toBe(10);
});

it('get/set in r1000', () => {
  let regs = new Registers(0);
  regs.set_r(1000, 10);
  expect(regs.get_r(1000)).toBe(10);
});

it('get default value', () => {
  let default_value = 666;
  let regs = new Registers(default_value);
  expect(regs.get_r(1000)).toBe(666);
});

it('two set operations in r1000', () => {
  let regs = new Registers(0);
  regs.set_r(1000, 10);
  regs.set_r(1000, 20);
  expect(regs.get_r(1000)).toBe(20);
});
