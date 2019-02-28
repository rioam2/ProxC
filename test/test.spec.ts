import chai = require('chai');
import mocha = require('mocha');
import { ProxC } from '../src';
import {
  IterableClass,
  InvokableClass,
  IndexableClass,
  ClassWithStorage
} from './testClasses';

const { describe, it } = mocha;
const { expect, should } = chai;

describe('Basic Functionality', () => {
  it('can be constructed', () => {
    let constructs = false;
    try {
      const prox = new ProxC();
      constructs = true;
    } catch (e) {}
    expect(constructs).to.be.true;
  });

  it('is a function prototype', () => {
    const prox = new ProxC();
    expect(typeof prox).to.equal(typeof Function);
  });

  it('has functional iterator Symbol', () => {
    const iter = new IterableClass();
    let res = [];
    for (const i of iter) res.push(i);
    for (let i = 0; i < 5; i++) {
      expect(res[i]).to.equal(i);
    }
  });

  it('can be invoked', () => {
    const mirror = new InvokableClass();
    [...new Array(10)].forEach((e, i) => {
      expect(mirror(i)).to.equal(i);
    });
  });

  it('has functional accessor operator', () => {
    const mirror = new IndexableClass();
    [...new Array(10)].forEach((e, i) => {
      expect(mirror[i]).to.equal(i);
      expect(mirror[i + 'string']).to.equal(i + 'string');
    });
  });

  it('can reference itself internally through "this" keyword', () => {
    const classWithStorage = new ClassWithStorage();
    classWithStorage.a = 10;
    classWithStorage.b = 2;
    expect(classWithStorage()).to.equal(20);

    const res: number[] = [];
    for (const i of classWithStorage) res.push(i);
    [6, 5, 4, 3, 2, 1, 0].forEach((e, i) => {
      expect(res[i]).to.equal(e);
    });
  });
});
