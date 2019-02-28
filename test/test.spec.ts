import chai = require('chai');
import mocha = require('mocha');
import { ProxC } from '../src';

const { describe, it } = mocha;
const { expect, should } = chai;

describe('Basic Functionality', () => {
  it('constructs', () => {
    let constructs = false;
    try {
      const prox = new ProxC();
      constructs = true;
    } catch (e) {}
    expect(constructs).to.be.true;
  });
  it('is a function prototype', () => {
    const prox = new ProxC();
    const props = Object.getOwnPropertyNames(prox);
    expect(JSON.stringify(props)).to.equal(JSON.stringify(['length', 'name']));
    expect(typeof prox).to.equal(typeof Function);
  });
});
