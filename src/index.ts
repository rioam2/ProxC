/* Necessary call/index signatures to make TypeScript happy :) */
export interface ProxC {
  (...args: any): any;
  [key: string]: any;
  [index: number]: any;
}

export abstract class ProxC {
  public *[Symbol.iterator](): IterableIterator<any> {}

  constructor() {
    /* Define iterator symbol on class for iteration */
    this[Symbol.iterator] = function*(this: any) {
      for (let elt of this['__iterator__']()) yield elt;
    };

    /* Forward custom implementation of fundamental operations
       to respective class methods */
    const proxyHandler = {
      get: (tar: any, prop: number | string) => {
        /* If member exists on class, dont use custom logic */
        if (tar[prop] !== undefined) {
          return tar[prop];
        } else {
          try {
            /* Handler captures prop as a string, try to convert if necessary */
            const nProp = Number(prop);
            return tar['__accessor__'].call(tar, nProp == prop ? nProp : prop);
          } catch (e) {
            return tar['__accessor__'].call(tar, prop);
          }
        }
      },
      apply: (tar: any, thisArg: any, argList: any[]) => {
        return tar['__invoke__'].call(thisArg || tar, ...argList);
      }
    };

    /* Create a new proxy object around the Function prototype
       to enable call interception (only viable on Function types) */
    const withProxy = new Proxy(Function, proxyHandler);

    /* Assign prototype chain of the class to the proxy wrapper */
    Object.assign(withProxy, this);
    Object.setPrototypeOf(withProxy, Object.getPrototypeOf(this));

    /* Return the wrapped class */
    return withProxy as ProxC;
  }

  /**
   * Defines how class should be handled as an iterable object.
   */
  protected __iterator__(): any[] {
    throw new TypeError(
      `ProxC: Class method __iterator__ must be implemented.\n`
    );
  }

  /**
   * Defines custom behavior for the class invocation/call operator.
   * Invoked whenever an instance of a class is called.
   */
  protected __invoke__(...argList: any): any {
    throw new TypeError(
      `ProxC: Class method __invoke__ must be implemented.\n\n`
    );
  }

  /**
   * Defines custom behavior for the class `get` operator (or otherwise
   * known as the accessor operator). Invoked whenever bracket notation
   * or dot notation is used on a class instance and the supplied
   * `prop` is not a member of the current class implementation.
   */
  protected __accessor__(prop: number | string): any {}
}
