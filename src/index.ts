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
      for (let elt of this['__iterator__']()) yield elt;
    }.bind(this);

    /* Forward custom implementation of fundamental operations
       to respective class methods */
    const proxyHandler = {
      get: (tar: any, prop: number | string) => {
        if (!tar) tar = this; /* Fallback if not bound */
        /* If member exists on class, dont use custom logic */
        if (tar[prop] !== undefined) {
          return tar[prop];
        } else {
          /* Handler captures prop as a string, convert if necessary */
          try {
            if (Number(prop) == prop) {
              return this['__accessor__'].call(tar, Number(prop));
            } else {
              return this['__accessor__'].call(tar, prop);
            }
          } catch (e) {
            return tar[prop];
          }
        }
      },
      apply: (tar: any, thisArg: any, argList: any[]) => {
        return this['__invoke__'].call(thisArg || this, ...argList);
      }
    };

    /* Create a new proxy object around the Function prototype
       to enable call interception (only viable on Function types) */
    const withProxy = new Proxy(Function, proxyHandler);

    /* Assign prototype chain of the class to the proxy wrapper */
    Object.assign(withProxy, this);
    Object.setPrototypeOf(withProxy, Object.getPrototypeOf(this));

    /* Bind context of all member methods to this instance */
    this.__accessor__ = this.__accessor__.bind(withProxy);
    this.__invoke__ = this.__invoke__.bind(withProxy);
    this.__iterator__ = this.__iterator__.bind(withProxy);

    /* Return the withProxy class */
    return withProxy as ProxC;
  }

  /**
   * A method that returns the default iterator for an object.
   * Called by the semantics of the for-of statement.
   * Implemented by the __iterator__ class method.
   */
  *[Symbol.iterator](): IterableIterator<any> {}

  /**
   * Defines how this class should be handled as an iterable object.
   *
   * @return `any[]` An iterable array to yield to for..of loops.
   */
  protected __iterator__() {
    /* This method should be overloaded by child classes, default
       behavior will throw a TypeError */

    /* Show file & line number of invocation in stderr */
    const stackArr = (new Error().stack as string).split(/\r\n|\n/);
    const traceIdx = stackArr.findIndex(elt => elt.includes('Object.next')) + 1;
    const trace = stackArr[traceIdx];
    const fileRef = (trace.split('/').pop() as string).slice(0, -1);
    /* Throw error with invocation trace */
    throw new TypeError(
      `${fileRef}: ProxC: Class method __iterator__ must be implemented.\n`
    );
    return new Array(); /* Make Typescript happy :) */
  }

  /**
   * Defines custom behavior for the class invocation/call operator.
   * Invoked whenever an instance of a class is called.
   *
   * Example: `myClass(1,2)` invokes `__invoke__(1,2)` on myClass.
   *
   * @param `...argList` variadic argument list
   */
  protected __invoke__(...argList: any) {
    throw new TypeError(
      `ProxC: Class method __invoke__ must be implemented.\n\n`
    );
    return undefined as any; /* Make Typescript happy :) */
  }

  /**
   * Defines custom behavior for the class `get` operator (or otherwise
   * known as the accessor operator). Invoked whenever bracket notation
   * or dot notation is used on a class instance and the supplied
   * `prop` is not a member of the current class implementation.
   *
   * Example: `myClass['hello']` invokes `__accessor__('hello')` on myClass.
   *
   * @param `prop` supplied index or key parameter
   */
  protected __accessor__(prop: number | string) {
    /* Only called when member DNE, default logic will return undefined */
    return undefined as any; /* Make Typescript happy :) */
  }
}
