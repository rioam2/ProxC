import chai = require('chai');
import mocha = require('mocha');
import {
  IterableClass,
  InvokableClass,
  IndexableClass,
  ClassWithStorage,
  ClassWithMemberMethods,
  ClassWithGettersSetters
} from './testClasses';

const { describe, it } = mocha;
const { expect, should } = chai;

describe('Basic Functionality', () => {
  it('is an iterable object (Symbol.iterator)', () => {
    const iter = new IterableClass();
    let res = [];
    for (const i of iter) res.push(i);
    for (let i = 0; i < 5; i++) {
      expect(res[i]).to.equal(i);
    }
  });

  it('is an invokable object (call operator)', () => {
    const mirror = new InvokableClass();
    [...new Array(10)].forEach((e, i) => {
      expect(mirror(i)).to.equal(i);
    });
  });

  it('is an accessible object (accessor operator)', () => {
    const mirror = new IndexableClass();
    [...new Array(10)].forEach((e, i) => {
      expect(mirror[i]).to.equal(i);
      expect(mirror[i + 'string']).to.equal(i + 'string');
    });
  });

  it('has correct context binding', () => {
    const classWithStorage = new ClassWithStorage();
    classWithStorage.a = 10;
    classWithStorage.b = 2;
    expect(classWithStorage()).to.equal(20);

    const res: number[] = [];
    for (const i of classWithStorage) res.push(i);
    [6, 5, 4, 3, 2, 1, 0].forEach((e, i) => {
      expect(res[i]).to.equal(e);
    });

    expect(classWithStorage.apple).to.equal('orange');
    expect(classWithStorage.saveTheWorld()).to.equal('easy');
    expect(classWithStorage.isCool).to.be.true;
  });

  it('has access to own member functions', () => {
    const classWithMember = new ClassWithMemberMethods();
    expect(classWithMember.memberFunc()).to.be.true;
  });

  it('has access to own setter/getter methods', () => {
    const cwgs = new ClassWithGettersSetters();
    expect(cwgs.map).to.equal("I'm the map!");
    cwgs.map = "It's the map!";
    expect(cwgs.map).to.equal("It's the map!");
  });
});
