import { ProxC } from '../src';

export class IterableClass extends ProxC {
  protected __iterator__() {
    return [0, 1, 2, 3, 4];
  }
}

export class InvokableClass extends ProxC {
  protected __invoke__(arg1: any) {
    return arg1;
  }
}

export class IndexableClass extends ProxC {
  protected __accessor__(prop: number | string) {
    return prop;
  }
}

export class ClassWithStorage extends ProxC {
  public a: number;
  public b: number;
  public apple: string;
  public isCool: boolean;
  public saveTheWorld: () => string;
  public internalArray: number[];

  constructor() {
    super();

    /* Setup internal storage */
    this.a = 1;
    this.b = 2;
    this.apple = 'orange';
    this.isCool = true;
    this.saveTheWorld = () => 'easy';
    this.internalArray = [0, 1, 2, 3, 4, 5, 6];
  }

  /* Indexes into the internalArray variable */
  protected __accessor__(prop: number) {
    return this.internalArray[prop];
  }

  /* Performs a*b */
  protected __invoke__() {
    return this.a * this.b;
  }

  protected __iterator__() {
    return this.internalArray.reverse();
  }
}

export class ClassWithMemberMethods extends ProxC {
  public memberFunc() {
    return true;
  }
}

export class ClassWithGettersSetters extends ProxC {
  constructor() {
    super();
    this.m = "I'm the map!";
  }
  public get map(): string {
    return this.m;
  }
  public set map(v: string) {
    this.map = v;
  }
}
