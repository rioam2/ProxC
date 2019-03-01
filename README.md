# ProxC

An NPM Package that allows you to create extensible classes and design declarative APIs that are a joy to use in Javascript

## Motivation

After completing an introductory Data Structures course at my university (shout out to Wade Fagen-Ulmschneider for being an awesome CS225 professor!), I decided to build a Binary Search Tree data structure in Javascript over my winter break. I learned a lot of things, as detailed in my (very long) development log on medium [here](https://medium.com/@riomartinez/how-to-build-a-binary-search-tree-in-javascript-with-es6-classes-any-why-d14cee13d6f7). I am generally a huge fan of Javascript, however implementing an API for my data structure left a lot to be desired after finishing a course based entirely in C++.

In C++, you can overload the functionality of basic operators used on a class. In layman terms, if I decide to call an instance of a class as if it were a function, I could define custom logic for that sort of invocation. The same goes for all other basic operators, including the `+`, `-`, `[]`, and `=` operators and quite a few more. This offers a new level of extensibility for defining custom APIs for your class implementations that are often exclusive to more lower-level programming languages like C++.

A few months later, and I discovered the beauty of ES6 Proxy Objects. Proxy Objects have a special prototype chain that allow you to intercept and define custom behavior for fundamental operations such as (you guessed it) property lookup/access `[]`, assignment `=`, enumeration, and function invocation `()`. As you can imagine, I automatically recognized that these could be used to design extensible ES6 classes that allowed synthetic operator overloading (possibly with some added overhead, but more on this later).

## API Documentation

By extending ProxC in a class definition, you are able to define custom logic for the following 3 operator hooks:

- **\_\_invoke\_\_(`...args: any`) : `any`**

  Defines custom behavior for the class invocation/call operator, `()`. Invoked whenever a class instance is called as a function and forwards all arguments. Context is bound to the current class instance enabling you to use `this` to refer to internal class state.

  If not defined, and the class attempts to be invoked, a TypeError will be thrown.

  _Example:_ `myClass(1,2)` calls `__invoke__(1,2)` on `myClass`.

- **\_\_accessor\_\_(`key: number|string`) : `any`**

  Defines custom behavior for the class 'get' operator, also known as the 'accessor' or 'index' operator (`[]` or `.`). Invoked when bracket notation or dot notation is used on a class instance and the supplied `key` is not a member of the current class implementation.

  If not defined, default behavior is assumed and the class accessor operator will still work as expected.

  _Example:_ `myClass['hello']` invokes `__accessor__('hello')` on `myClass` if and only if `myClass` does not contain a member named `hello` and `__accessor__` is defined.

- **\_\_iterator\_\_() : `any[]`**

  Defines how the class should be treated as an iterable object. Should return an array of elements that can be yielded to `for..of` loops.

  If not defined, and the class attempts to be iterated, a TypeError will be thrown.

  _Example:_ `for(const elt of myClass)` loops over the return value of `__iterator__` on `myClass`.

## Example usage as Middleware

Let's say we want to design a way to keep track of all operations Array.sort() invokes on its comparer callback.
This becomes very easy with ProxC. The example that follows does this by overloading the `__invoke__` hook inherited by ProxC.

```javascript
/* Import ProxC Base Class */
const { ProxC } = require('proxc');

/**
 * This class is used as a compare callback for
 * Array.sort(). Each invocation appends its call to
 * the internal history member of the class. By
 * extending ProxC, we inherit the __invoke__ hook.
 */
class SorterWithMiddleware extends ProxC {
  constructor() {
    /* Important if adding members to class */
    super();
    this.history = [];

    /* Function declarations must be done here. This
       is a design flaw that should be fixed (see 
       CONTRIBUTING.md) */
    this.logHistory = () => {
      console.log(JSON.stringify(this.history, null, 2));
    };
  }

  /* Called when the class is invoked as a function */
  __invoke__(first, second) {
    /* Basic sorting (see Array.sort() docs) */
    const weight = first < second ? -1 : 1;
    /* Custom Middleware */
    this.history.push({ first, second, weight });
    /* Return determination to Array.sort() */
    return weight;
  }
}

/* Let's use it! */
const sorter = new SorterWithMiddleware();
const arrToSort = [9, 1, 4, 4];
arrToSort.sort(sorter);

sorter.logHistory();

/* 
Output:

[
  {
    "first": 9,
    "second": 1,
    "weight": 1
  },
  {
    "first": 9,
    "second": 4,
    "weight": 1
  },
  {
    "first": 1,
    "second": 4,
    "weight": -1
  },
  {
    "first": 9,
    "second": 4,
    "weight": 1
  },
  {
    "first": 4,
    "second": 4,
    "weight": 0
  }
]
 */
```
