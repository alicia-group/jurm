

const REGISTER_INDEX = 0;
const REGISTER_VALUE = 1;

class Registers {

  constructor(default_value) {
    this.default_value = default_value;
    this.arr = [];
  }

  get_r(register) {
    for (let [register_index, register_value] of this.arr) {
      if (register_index == register) {
        return register_value;
      }
    }
    return this.default_value;
  }

  set_r(register, value) {
    let register_index;
    for (let array_index = 0; array_index < this.arr.length; array_index++) {
      register_index = this.arr[array_index][REGISTER_INDEX];
      if (register_index == register) {
        this.arr[array_index][REGISTER_VALUE] = value;
        return;
      }
    }
    this.arr.push([register, value]);
  }

}

export default Registers;