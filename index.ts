class ProxC extends Function {
  constructor() {
    /* Inherit callable prototype chain */
    super();

    /* Make class iterable if __ITER__ is overloaded */
    if (this['__ITER__'] !== undefined) {
      this[Symbol.iterator] = function*() {
        for (let elt of this['__ITER__']()) yield elt;
      };
    }

    /* Return class wrapped in a proxy */
    return new Proxy(this, {
      get: (inst, prop) => {
        /* Determine if operator default should be used */
        if (inst['__GET__'] !== undefined && inst[prop] === undefined) {
          return inst['__GET__'].apply(inst, [prop]);
        } else {
          return inst[prop];
        }
      },
      apply: (inst, thisArg, argList) => {
        if (inst['__APPLY__'] === undefined) {
          throw new TypeError(`ProxC: No viable call overload.`);
        } else if (thisArg === this) {
          return inst['__APPLY__'](...argList);
        } else {
          return inst['__APPLY__'].apply(thisArg, argList);
        }
      }
    });
  }

  __ITER__() {
    return [1, 2, 3, 4];
  }

  __APPLY__(...argList) {
    console.log(this);
  }

  __GET__(prop) {
    console.log(this);
    return prop;
  }
}

const prox = new ProxC();
prox(1);
