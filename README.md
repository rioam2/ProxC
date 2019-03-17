<img src="assets/proxc_logo.png" alt="ProxC Logo" width="400">

[![Build Status](https://travis-ci.com/rioam2/ProxC.svg?branch=master)](https://travis-ci.com/rioam2/ProxC)
[![Coverage Status](https://coveralls.io/repos/github/rioam2/ProxC/badge.svg?branch=master)](https://coveralls.io/github/rioam2/ProxC?branch=master)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![NPM Version](https://img.shields.io/npm/v/proxc.svg)](https://github.com/rioam2/bstjs)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

ProxC is an NPM Package that allows you to create extensible classes and design declarative APIs that are a joy to use.

## Motivation

This package was heavily inspired by C++. In C++, you can overload the functionality of basic operators used on a class. This offers a new level of extensibility for defining custom APIs for your class implementations that are often exclusive to more lower-level programming languages.

In Javascript, Proxy Objects allow you to intercept and define custom behavior for fundamental operations such as property lookup/access `[]`, assignment `=`, enumeration, and function invocation `()`. These can be used to design extensible ES6 classes that allow synthetic operator definition with functionality similar to that of operator overloading in languages such as C++.

## API Documentation

By extending ProxC in your class definition and defining the following member functions, you are able to design a fully custom interface for your API:

- **\_\_invoke\_\_(`...args: any`) → `any`**

  Defines custom behavior for the class invocation/call operator, `()`. Invoked whenever a class instance is called as a function and forwards all arguments. Context is bound to the current class instance enabling you to use `this` to refer to internal class state.

  If not defined, and the class attempts to be invoked, a TypeError will be thrown.

  _Example: `myClass(1,2)` calls `__invoke__(1,2)` on `myClass`._

- **\_\_accessor\_\_(`key: number|string`) → `any`**

  Defines custom behavior for the class 'get' operator, also known as the 'accessor' or 'index' operator (`[]` or `.`). Invoked when bracket notation or dot notation is used on a class instance and the supplied `key` is not a member of the current class implementation.

  If not defined, default behavior is assumed and the class accessor operator will still work as expected.

  _Example: `myClass['hello']` invokes `__accessor__('hello')` on `myClass` if and only if `myClass` does not contain a member named `hello` and `__accessor__` is implemented._

- **\_\_iterator\_\_() → `any[]`**

  Defines how the class should be treated as an iterable object. Should return an array of elements that can be yielded to `for..of` loops.

  If not defined, and the class attempts to be iterated, a TypeError will be thrown.

  _Example: `for (const elt of myClass) {...}` loops over the iterable returned by `__iterator__` on `myClass`._
