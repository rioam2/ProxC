/* Necessary call/index signatures to make TypeScript happy :) */
export interface ProxC {
  (...args: any): any;
  [key: string]: any;
  [index: number]: any;
}

export class ProxC {
  constructor() {
    /* Define iterator symbol on class for iteration */
    this[Symbol.iterator] = function*(this: any) {
      for (let elt of this['__proto__iterate__']()) yield elt;
    }.bind(this);

    /* Forward custom implementation of fundamental operations
       to respective class methods */
    const handler = {
      get: (tar: any, prop: number | string) => {
        if (!tar) tar = this; /* Fallback if not bound */
        /* If member exists on class, dont use custom logic */
        if (tar[prop] !== undefined) {
          return tar[prop];
        } else {
          /* Handler captures prop as a string, convert if necessary */
          try {
            if (Number(prop) == prop) {
              return this['__proto__index__'].call(tar, Number(prop));
            } else {
              return this['__proto__index__'].call(tar, prop);
            }
          } catch (e) {
            return tar[prop];
          }
        }
      },
      apply: (tar: any, thisArg: any, argList: any[]) => {
        return this['__proto__invoke__'].call(thisArg || this, ...argList);
      }
    };

    /* The next few lines merge this class prototype chain
       into that of a new bound function to enable the 'apply'
       hook through the Function's invocation prototype */
    const func = new Function().bind(this);
    const merged = Object.assign(func, this);
    const withProxy = new Proxy(merged, handler);

    /* Rebind context with class to rebuild inheritance chain */
    const final = Object.assign(withProxy, this);

    /* Bind context of all member methods to this instance */
    this.__proto__index__ = this.__proto__index__.bind(final);
    this.__proto__invoke__ = this.__proto__invoke__.bind(final);
    this.__proto__iterate__ = this.__proto__iterate__.bind(final);

    /* Return the final wrapped class */
    return final as ProxC;
  }

  /**
   * A method that returns the default iterator for an object.
   * Called by the semantics of the for-of statement.
   * Implemented by the __proto__iterate__ class method.
   */
  *[Symbol.iterator](): IterableIterator<any> {}

  /**
   * Defines how this class should be handled as an iterable object.
   *
   * @return `any[]` An iterable array to yield to for..of loops.
   */
  protected __proto__iterate__() {
    /* This method should be overloaded by child classes, default
       behavior will throw a TypeError */

    /* Show file & line number of invocation in stderr */
    const stackArr = (new Error().stack as string).split(/\r\n|\n/);
    const traceIdx = stackArr.findIndex(elt => elt.includes('Object.next')) + 1;
    const trace = stackArr[traceIdx];
    const fileRef = (trace.split('/').pop() as string).slice(0, -1);
    /* Throw error with invocation trace */
    throw new TypeError(
      `${fileRef}: ProxC: Class method __proto__iterate__ must be implemented.\n`
    );
    return new Array(); /* Make Typescript happy :) */
  }

  /**
   * Defines custom behavior for the class invocation/call operator.
   * Invoked whenever an instance of a class is called.
   *
   * Example: `myClass(1,2)` invokes `__proto__invoke__(1,2)` on myClass.
   *
   * @param `...argList` variadic argument list
   */
  protected __proto__invoke__(...argList: any) {
    throw new TypeError(
      `ProxC: Class method __proto__invoke__ must be implemented.\n\n`
    );
    return undefined as any; /* Make Typescript happy :) */
  }

  /**
   * Defines custom behavior for the class `get` operator (or otherwise
   * known as the index operator). Invoked whenever bracket notation
   * or dot notation is used on a class instance and the supplied
   * `prop` is not a member of the current class implementation.
   *
   * Example: `myClass['hello']` invokes `__proto__index__('hello')` on myClass.
   *
   * @param `prop` supplied index or key parameter
   */
  protected __proto__index__(prop: number | string) {
    /* Only called when member DNE, default logic will return undefined */
    return undefined as any; /* Make Typescript happy :) */
  }
}
