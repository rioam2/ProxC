const { ProxC } = require('../dist/src');

class CircularArray extends ProxC {
  constructor(arr) {
    /* Call ProxC Constructor First */
    super();
    /* If array supplied, copy into internal state */
    if (Array.isArray(arr)) {
      this.internalArr = arr.slice();
    }
  }

  __accessor__(arg) {
    const { internalArr } = this;
    const length = internalArr.length;

    /* Return circular indexed element */
    if (typeof arg == 'number') {
      if (arg < 0) {
        return internalArr[(length + arg) % length];
      } else {
        return internalArr[arg % length];
      }
    }

    /* Special handling for .first and .last */
    if (arg === 'first') return this.__accessor__(0);
    if (arg === 'last') return this.__accessor__(-1);
    if (arg === 'rand')
      return this.__accessor__(Math.round(length * Math.random()));

    /* Default action returns undefined */
    return undefined;
  }
}

const circular = new CircularArray([0, 1, 2, 3, 4, 5]);
console.log(`circular array: ${JSON.stringify(circular.internalArr)}`);
console.log(`circular.first = ${circular.first}`);
console.log(`circular.last = ${circular.last}`);
console.log(`circular.rand = ${circular.rand}`);
console.log(`circular[-2] = ${circular[-2]}`);
console.log(`circular[2] = ${circular[2]}`);
console.log(`circular[27] = ${circular[27]}`);
